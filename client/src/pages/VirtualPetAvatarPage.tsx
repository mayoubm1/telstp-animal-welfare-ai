import { useEffect, useRef, useState } from 'react';
import { trpc } from '@/lib/trpc';
import { useAuth } from '@/_core/hooks/useAuth';
import { useRouter } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Loader2, Send, Sparkles } from 'lucide-react';

export default function VirtualPetAvatarPage() {
  const { user } = useAuth();
  const [, setLocation] = useRouter();
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [selectedAvatarId, setSelectedAvatarId] = useState<number | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Get user's pets
  const { data: pets } = trpc.pets.list.useQuery();

  // Get or create avatar
  const { data: avatar } = trpc.virtualPetAvatar.getAvatarByPet.useQuery(
    { petId: selectedPetId || 0 },
    { enabled: !!selectedPetId }
  );

  // Get conversation history
  const { data: conversations } = trpc.virtualPetAvatar.getConversationHistory.useQuery(
    { avatarId: selectedAvatarId || 0, limit: 50 },
    { enabled: !!selectedAvatarId }
  );

  // Send message mutation
  const sendMessageMutation = trpc.virtualPetAvatar.sendMessage.useMutation({
    onSuccess: () => {
      setMessage('');
      setIsLoading(false);
    },
    onError: () => {
      setIsLoading(false);
    },
  });

  // Create avatar mutation
  const createAvatarMutation = trpc.virtualPetAvatar.createAvatar.useMutation({
    onSuccess: (newAvatar) => {
      setSelectedAvatarId(newAvatar.id);
    },
  });

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversations]);

  // Set avatar when it loads
  useEffect(() => {
    if (avatar && !selectedAvatarId) {
      setSelectedAvatarId(avatar.id);
    }
  }, [avatar, selectedAvatarId]);

  const handleSelectPet = async (petId: number) => {
    setSelectedPetId(petId);
    
    // Check if avatar exists, if not create one
    const pet = pets?.find(p => p.id === petId);
    if (pet && !avatar) {
      createAvatarMutation.mutate({
        petId,
        name: `${pet.name}'s Companion`,
        nameAr: `رفيق ${pet.name}`,
        personality: 'Wise and Caring',
        personalityAr: 'حكيم وعطوف',
      });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedAvatarId || isLoading) return;

    setIsLoading(true);
    sendMessageMutation.mutate({
      avatarId: selectedAvatarId,
      message: message.trim(),
      messageType: 'chat',
    });
  };

  if (!user) {
    return <div className="p-4">Please log in to use Virtual Pet Avatar</div>;
  }

  const selectedPet = pets?.find(p => p.id === selectedPetId);

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950 p-4 md:p-8">
      {/* Header */}
      <div className="mb-8 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Sparkles className="w-8 h-8 text-yellow-400" />
          <h1 className="text-4xl font-bold text-yellow-100">Virtual Pet Companion</h1>
          <Sparkles className="w-8 h-8 text-yellow-400" />
        </div>
        <p className="text-yellow-200">Meet your AI-powered pet guide and trainer</p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Pet Selection Sidebar */}
        <div className="lg:col-span-1">
          <Card className="bg-amber-800/50 border-yellow-600/30 p-4">
            <h2 className="text-xl font-bold text-yellow-100 mb-4">Your Pets</h2>
            <div className="space-y-2">
              {pets?.map((pet) => (
                <button
                  key={pet.id}
                  onClick={() => handleSelectPet(pet.id)}
                  className={`w-full p-3 rounded-lg text-left transition-all ${
                    selectedPetId === pet.id
                      ? 'bg-yellow-500/30 border-2 border-yellow-400 text-yellow-100'
                      : 'bg-amber-700/30 border border-yellow-600/20 text-yellow-200 hover:bg-amber-700/50'
                  }`}
                >
                  <div className="font-semibold">{pet.name}</div>
                  <div className="text-sm opacity-75">{pet.species}</div>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-3">
          {selectedPet && selectedAvatarId ? (
            <div className="space-y-4">
              {/* Avatar Info */}
              <Card className="bg-amber-800/50 border-yellow-600/30 p-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-amber-600 flex items-center justify-center">
                    <Sparkles className="w-8 h-8 text-yellow-100" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-yellow-100">{avatar?.name}</h3>
                    <p className="text-yellow-200">{avatar?.personality}</p>
                    <p className="text-sm text-yellow-300">Interactions: {avatar?.totalInteractions || 0}</p>
                  </div>
                </div>
              </Card>

              {/* Messages */}
              <Card className="bg-amber-900/50 border-yellow-600/30 p-4 h-96 overflow-y-auto">
                <div className="space-y-4">
                  {conversations && conversations.length > 0 ? (
                    conversations.map((conv) => (
                      <div key={conv.id} className="space-y-2">
                        {/* User Message */}
                        <div className="flex justify-end">
                          <div className="bg-yellow-600/40 text-yellow-100 rounded-lg p-3 max-w-xs">
                            {conv.userMessage}
                          </div>
                        </div>
                        {/* Avatar Response */}
                        <div className="flex justify-start">
                          <div className="bg-amber-700/40 text-yellow-100 rounded-lg p-3 max-w-xs">
                            {conv.avatarResponse}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-yellow-300 py-8">
                      Start a conversation with your pet's companion!
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </Card>

              {/* Input Form */}
              <form onSubmit={handleSendMessage} className="flex gap-2">
                <Input
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask your pet's companion..."
                  disabled={isLoading}
                  className="bg-amber-800/50 border-yellow-600/30 text-yellow-100 placeholder:text-yellow-400/50"
                />
                <Button
                  type="submit"
                  disabled={isLoading || !message.trim()}
                  className="bg-yellow-600 hover:bg-yellow-700 text-amber-950"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </form>
            </div>
          ) : (
            <Card className="bg-amber-800/50 border-yellow-600/30 p-8 text-center">
              <Sparkles className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <p className="text-yellow-200 text-lg">Select a pet to meet its virtual companion</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
