import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Switch } from './ui/switch';
import { 
  User, 
  Star, 
  Shield, 
  Phone, 
  Mail, 
  IdCard, 
  Car,
  Edit,
  Check,
  X,
  AlertCircle,
  Plus,
  Trash2
} from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';

export function Profile() {
  const { user, updateProfile } = useAuth();
  const { t } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    bio: user?.bio || '',
    phone: user?.phone || '',
  });

  if (!user) return null;

  const handleSave = async () => {
    await updateProfile(formData);
    setIsEditing(false);
  };

  const getVerificationColor = (status: string) => {
    switch (status) {
      case 'verified': return 'text-green-600 bg-green-50';
      case 'pending': return 'text-yellow-600 bg-yellow-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Profile Header */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <Avatar className="size-24">
              <AvatarImage src={user.avatar} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {user.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="text-2xl font-medium"
                    />
                  ) : (
                    <h2 className="text-2xl font-medium">{user.name}</h2>
                  )}
                  <p className="text-muted-foreground">{user.email}</p>
                </div>

                {isEditing ? (
                  <div className="flex gap-2">
                    <Button onClick={handleSave} size="sm">
                      <Check className="size-4 mr-2" />
                      {t('common.save')}
                    </Button>
                    <Button onClick={() => setIsEditing(false)} variant="outline" size="sm">
                      <X className="size-4 mr-2" />
                      {t('common.cancel')}
                    </Button>
                  </div>
                ) : (
                  <Button onClick={() => setIsEditing(true)} variant="outline" size="sm">
                    <Edit className="size-4 mr-2" />
                    {t('profile.edit')}
                  </Button>
                )}
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center gap-2">
                  <Star className="size-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{user.rating.toFixed(1)}</span>
                  <span className="text-muted-foreground text-sm">{t('profile.rating')}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Car className="size-5 text-primary" />
                  <span className="font-medium">{user.totalTrips}</span>
                  <span className="text-muted-foreground text-sm">{t('profile.trips')}</span>
                </div>
                {user.isVerified && (
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    <Shield className="size-3 mr-1" />
                    {t('verify.verified')}
                  </Badge>
                )}
              </div>

              {/* Bio */}
              {isEditing ? (
                <div>
                  <Label>{t('profile.bio')}</Label>
                  <Textarea
                    value={formData.bio}
                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                    placeholder="Tell us about yourself..."
                    rows={3}
                  />
                </div>
              ) : user.bio ? (
                <p className="text-muted-foreground">{user.bio}</p>
              ) : (
                <p className="text-muted-foreground italic">No bio yet</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="verification" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="verification">{t('profile.verification')}</TabsTrigger>
          <TabsTrigger value="preferences">{t('profile.preferences')}</TabsTrigger>
          <TabsTrigger value="emergency">{t('profile.emergencyContacts')}</TabsTrigger>
        </TabsList>

        {/* Verification Tab */}
        <TabsContent value="verification" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.verification')}</CardTitle>
              <CardDescription>
                Verify your identity to build trust with other users
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {user.verificationStatus === 'none' && (
                <Alert>
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    Complete verification to unlock all features and gain trust from other users
                  </AlertDescription>
                </Alert>
              )}

              {/* ID Verification */}
              <VerificationItem
                icon={<IdCard className="size-5" />}
                title={t('verify.id')}
                verified={user.verificationBadges.idVerified}
                status={user.verificationBadges.idVerified ? 'verified' : 'none'}
              />

              {/* Phone Verification */}
              <VerificationItem
                icon={<Phone className="size-5" />}
                title={t('verify.phone')}
                verified={user.verificationBadges.phoneVerified}
                status={user.verificationBadges.phoneVerified ? 'verified' : 'none'}
              />

              {/* Email Verification */}
              <VerificationItem
                icon={<Mail className="size-5" />}
                title={t('verify.email')}
                verified={user.verificationBadges.emailVerified}
                status={user.verificationBadges.emailVerified ? 'verified' : 'none'}
              />

              {/* Driver License */}
              {user.isDriver && (
                <VerificationItem
                  icon={<Car className="size-5" />}
                  title={t('verify.license')}
                  verified={user.verificationBadges.driverLicenseVerified}
                  status={user.verificationBadges.driverLicenseVerified ? 'verified' : 'none'}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t('profile.preferences')}</CardTitle>
              <CardDescription>
                Set your preferences for a better ride experience
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Smoking</p>
                  <p className="text-sm text-muted-foreground">Allow smoking in vehicle</p>
                </div>
                <Switch
                  checked={user.preferences.smoking}
                  onCheckedChange={(checked) =>
                    updateProfile({ preferences: { ...user.preferences, smoking: checked } })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Music</p>
                  <p className="text-sm text-muted-foreground">Play music during trips</p>
                </div>
                <Switch
                  checked={user.preferences.music}
                  onCheckedChange={(checked) =>
                    updateProfile({ preferences: { ...user.preferences, music: checked } })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Pets</p>
                  <p className="text-sm text-muted-foreground">Allow pets in vehicle</p>
                </div>
                <Switch
                  checked={user.preferences.pets}
                  onCheckedChange={(checked) =>
                    updateProfile({ preferences: { ...user.preferences, pets: checked } })
                  }
                />
              </div>

              <div>
                <Label>Conversation Level</Label>
                <div className="grid grid-cols-3 gap-2 mt-2">
                  {(['quiet', 'moderate', 'chatty'] as const).map((level) => (
                    <Button
                      key={level}
                      variant={user.preferences.conversation === level ? 'default' : 'outline'}
                      onClick={() =>
                        updateProfile({ preferences: { ...user.preferences, conversation: level } })
                      }
                      className="capitalize"
                    >
                      {level}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Emergency Contacts Tab */}
        <TabsContent value="emergency" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{t('profile.emergencyContacts')}</CardTitle>
                  <CardDescription>
                    Add trusted contacts for safety during trips
                  </CardDescription>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="size-4 mr-2" />
                      Add Contact
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Emergency Contact</DialogTitle>
                      <DialogDescription>
                        This contact will be notified in case of emergency
                      </DialogDescription>
                    </DialogHeader>
                    <EmergencyContactForm />
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent>
              {user.emergencyContacts.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <AlertCircle className="size-12 mx-auto mb-4 opacity-50" />
                  <p>No emergency contacts added yet</p>
                  <p className="text-sm">Add contacts to enhance your safety</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {user.emergencyContacts.map((contact) => (
                    <div
                      key={contact.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">{contact.name}</p>
                        <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Trash2 className="size-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function VerificationItem({
  icon,
  title,
  verified,
  status,
}: {
  icon: React.ReactNode;
  title: string;
  verified: boolean;
  status: 'verified' | 'pending' | 'rejected' | 'none';
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-muted rounded-lg">{icon}</div>
        <div>
          <p className="font-medium">{title}</p>
          <p className="text-sm text-muted-foreground">
            {verified ? 'Verified' : 'Not verified'}
          </p>
        </div>
      </div>
      {verified ? (
        <Badge className="bg-green-100 text-green-800 border-green-200">
          <Check className="size-3 mr-1" />
          Verified
        </Badge>
      ) : (
        <Button size="sm" variant="outline">
          Verify Now
        </Button>
      )}
    </div>
  );
}

function EmergencyContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    relationship: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Add emergency contact logic
    console.log('Add emergency contact:', formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Contact name"
          required
        />
      </div>
      <div>
        <Label>Phone Number</Label>
        <Input
          type="tel"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          placeholder="+971 XX XXX XXXX"
          required
        />
      </div>
      <div>
        <Label>Relationship</Label>
        <Input
          value={formData.relationship}
          onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
          placeholder="e.g., Spouse, Parent, Friend"
          required
        />
      </div>
      <Button type="submit" className="w-full">
        Add Contact
      </Button>
    </form>
  );
}
