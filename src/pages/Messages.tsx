import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { db } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  orderBy, 
  onSnapshot, 
  addDoc, 
  serverTimestamp, 
  doc, 
  getDoc, 
  setDoc,
  updateDoc
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';
import { useAuthStore } from '@/stores/useAuthStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, MessageSquare, User, ArrowLeft, Phone } from 'lucide-react';
import { format } from 'date-fns';
import { ka } from 'date-fns/locale';

const Messages = () => {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [chats, setChats] = useState<any[]>([]);
  const [activeChat, setActiveChat] = useState<any | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [userProfiles, setUserProfiles] = useState<Record<string, any>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const chatWithId = searchParams.get('chatWith');

  // Fetch user profiles for participants
  useEffect(() => {
    const fetchProfiles = async () => {
      const uids = new Set<string>();
      chats.forEach(chat => {
        chat.participants.forEach((uid: string) => {
          if (uid !== user?.uid) uids.add(uid);
        });
      });
      if (activeChat) {
        activeChat.participants.forEach((uid: string) => {
          if (uid !== user?.uid) uids.add(uid);
        });
      }

      const newProfiles = { ...userProfiles };
      let updated = false;

      for (const uid of uids) {
        if (!newProfiles[uid]) {
          try {
            const userDoc = await getDoc(doc(db, 'users', uid));
            if (userDoc.exists()) {
              newProfiles[uid] = userDoc.data();
              updated = true;
            }
          } catch (error) {
            console.error('Error fetching user profile:', error);
          }
        }
      }

      if (updated) {
        setUserProfiles(newProfiles);
      }
    };

    if (chats.length > 0 || activeChat) {
      fetchProfiles();
    }
  }, [chats, activeChat, user]);

  // Fetch chats
  useEffect(() => {
    if (!user) return;

    const q = query(
      collection(db, 'chats'),
      where('participants', 'array-contains', user.uid),
      orderBy('updatedAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setChats(chatsData);
      setLoading(false);
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, 'chats');
    });

    return () => unsubscribe();
  }, [user]);

  // Handle chatWith parameter
  useEffect(() => {
    if (!user || !chatWithId || chatWithId === user.uid) return;

    const startChat = async () => {
      const chatId = [user.uid, chatWithId].sort().join('_');
      const chatRef = doc(db, 'chats', chatId);
      try {
        const chatSnap = await getDoc(chatRef);

        if (!chatSnap.exists()) {
          await setDoc(chatRef, {
            participants: [user.uid, chatWithId],
            updatedAt: serverTimestamp(),
            lastMessage: '',
          });
        }
        
        const chatData = (await getDoc(chatRef)).data();
        setActiveChat({ id: chatId, ...chatData });
      } catch (error: any) {
        if (error.message && error.message.includes('{"error":')) throw error;
        handleFirestoreError(error, OperationType.GET, `chats/${chatId}`);
      }
    };

    startChat();
  }, [user, chatWithId]);

  // Fetch messages for active chat
  useEffect(() => {
    if (!activeChat) return;

    const q = query(
      collection(db, 'chats', activeChat.id, 'messages'),
      orderBy('createdAt', 'asc')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const messagesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(messagesData);
      scrollToBottom();
    }, (error) => {
      handleFirestoreError(error, OperationType.LIST, `chats/${activeChat.id}/messages`);
    });

    return () => unsubscribe();
  }, [activeChat]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !activeChat || !newMessage.trim()) return;

    const messageText = newMessage.trim();
    setNewMessage('');

    try {
      const messagePath = `chats/${activeChat.id}/messages`;
      await addDoc(collection(db, messagePath), {
        chatId: activeChat.id,
        senderId: user.uid,
        text: messageText,
        createdAt: serverTimestamp(),
      });

      await updateDoc(doc(db, 'chats', activeChat.id), {
        lastMessage: messageText,
        updatedAt: serverTimestamp(),
      });
    } catch (error: any) {
      console.error('Error sending message:', error);
      if (error.message && error.message.includes('{"error":')) throw error;
      handleFirestoreError(error, OperationType.WRITE, `chats/${activeChat.id}`);
    }
  };

  const getOtherParticipant = (chat: any) => {
    return chat.participants.find((p: string) => p !== user?.uid);
  };

  return (
    <div className="py-24 bg-background min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-primary/5 blur-[140px] -z-10" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 blur-[120px] -z-10" />

      <div className="h-[80vh] flex gap-8 max-w-screen-2xl mx-auto px-6 relative z-10">
        {/* Chat List */}
        <Card className={`w-full md:w-96 rounded-[3rem] border-none shadow-2xl shadow-black/5 overflow-hidden flex flex-col bg-card/50 backdrop-blur-sm border border-border/50 ${activeChat ? 'hidden md:flex' : 'flex'}`}>
          <div className="p-8 border-b border-border/50 bg-card/50 backdrop-blur">
            <h2 className="text-2xl font-black tracking-tighter flex items-center gap-3">
              <MessageSquare className="h-6 w-6 text-primary" />
              ჩატები
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-secondary/10">
            {chats.length === 0 && !loading ? (
              <div className="text-center py-20 px-6 space-y-4">
                <div className="h-20 w-20 rounded-[2rem] bg-card flex items-center justify-center mx-auto shadow-xl">
                  <MessageSquare className="h-10 w-10 text-muted-foreground/20" />
                </div>
                <p className="text-sm text-muted-foreground font-medium">ჩატები არ მოიძებნა</p>
              </div>
            ) : (
              chats.map(chat => (
                <button
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`w-full p-5 rounded-[2rem] flex items-center gap-4 transition-all duration-300 group ${
                    activeChat?.id === chat.id 
                      ? 'bg-background shadow-xl scale-[1.02] ring-1 ring-primary/10' 
                      : 'hover:bg-background/50'
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-14 w-14 border-2 border-background shadow-lg">
                      <AvatarImage src={userProfiles[getOtherParticipant(chat)]?.photoURL} />
                      <AvatarFallback className="bg-primary/5 text-primary font-black text-lg">
                        {userProfiles[getOtherParticipant(chat)]?.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background shadow-sm" />
                  </div>
                  <div className="flex-1 text-left overflow-hidden space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-black tracking-tight truncate">
                        {userProfiles[getOtherParticipant(chat)]?.displayName || 'მომხმარებელი'}
                      </p>
                      {chat.updatedAt && (
                        <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                          {format(chat.updatedAt.toDate(), 'HH:mm')}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground font-medium truncate opacity-70 group-hover:opacity-100 transition-opacity">
                      {chat.lastMessage || 'შეტყობინება არ არის'}
                    </p>
                  </div>
                </button>
              ))
            )}
          </div>
        </Card>

        {/* Chat Window */}
        <Card className={`flex-1 rounded-[3rem] border-none shadow-2xl shadow-black/5 overflow-hidden flex flex-col bg-card/50 backdrop-blur-sm border border-border/50 ${!activeChat ? 'hidden md:flex' : 'flex'}`}>
          {activeChat ? (
            <>
              <div className="p-6 border-b border-border/50 flex items-center justify-between bg-card/50 backdrop-blur sticky top-0 z-10">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="icon" className="md:hidden rounded-2xl" onClick={() => setActiveChat(null)}>
                    <ArrowLeft className="h-6 w-6" />
                  </Button>
                  <div className="relative">
                    <Avatar className="h-12 w-12 border-2 border-background shadow-lg">
                      <AvatarImage src={userProfiles[getOtherParticipant(activeChat)]?.photoURL} />
                      <AvatarFallback className="bg-primary/5 text-primary font-black">
                        {userProfiles[getOtherParticipant(activeChat)]?.displayName?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="absolute bottom-0 right-0 h-3.5 w-3.5 rounded-full bg-emerald-500 border-2 border-background" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-black tracking-tight">
                      {userProfiles[getOtherParticipant(activeChat)]?.displayName || 'მომხმარებელი'}
                    </p>
                    <p className="text-[10px] text-emerald-500 font-black uppercase tracking-widest">ონლაინ</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="icon" className="h-12 w-12 rounded-2xl hover:bg-primary/10 hover:text-primary transition-all active:scale-90 shadow-sm border border-border/50">
                    <Phone className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-6 bg-secondary/5">
                {messages.map((msg) => (
                  <div key={msg.id} className={`flex ${msg.senderId === user?.uid ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[70%] p-5 rounded-[2rem] text-sm shadow-sm transition-all hover:shadow-md ${
                      msg.senderId === user?.uid 
                        ? 'bg-primary text-primary-foreground rounded-tr-none font-medium' 
                        : 'bg-background border border-border/50 rounded-tl-none font-medium'
                    }`}>
                      <p className="leading-relaxed">{msg.text}</p>
                      <p className={`text-[10px] mt-2 text-right font-black uppercase tracking-widest opacity-50 ${msg.senderId === user?.uid ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {msg.createdAt && format(msg.createdAt.toDate(), 'HH:mm')}
                      </p>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-6 border-t border-border/50 bg-card/50 backdrop-blur">
                <form onSubmit={handleSendMessage} className="flex gap-4 items-center max-w-4xl mx-auto">
                  <div className="relative flex-1 group">
                    <Input 
                      placeholder="დაწერეთ შეტყობინება..." 
                      className="h-16 rounded-[2rem] border-none bg-secondary/50 px-8 focus-visible:ring-2 focus-visible:ring-primary/20 transition-all text-base font-medium"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                    />
                  </div>
                  <Button type="submit" size="icon" className="h-16 w-16 rounded-[2rem] shrink-0 shadow-2xl shadow-primary/20 transition-all active:scale-90 bg-primary hover:bg-primary/90">
                    <Send className="h-6 w-6" />
                  </Button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-12 space-y-8">
              <div className="h-32 w-32 rounded-[3rem] bg-secondary/50 flex items-center justify-center text-primary/20 shadow-inner">
                <MessageSquare className="h-16 w-16" />
              </div>
              <div className="space-y-3">
                <h3 className="text-3xl font-black tracking-tighter">აირჩიეთ ჩატი</h3>
                <p className="text-muted-foreground font-medium max-w-xs mx-auto leading-relaxed">
                  დაიწყეთ მიმოწერა ტვირთის მფლობელთან ან გადამზიდველთან დეტალების დასაზუსტებლად
                </p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Messages;
