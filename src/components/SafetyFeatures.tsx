import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Alert, AlertDescription } from './ui/alert';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { 
  AlertTriangle, 
  Share2, 
  Phone, 
  MapPin, 
  Shield,
  Check,
  Copy,
  Users
} from 'lucide-react';
import { toast } from 'sonner@2.0.3';

interface SafetyFeaturesProps {
  tripId?: string;
  driverName?: string;
  from?: string;
  to?: string;
  currentLocation?: { lat: number; lng: number };
}

export function SafetyFeatures({ tripId, driverName, from, to, currentLocation }: SafetyFeaturesProps) {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sosDialogOpen, setSosDialogOpen] = useState(false);
  const [emergencySent, setEmergencySent] = useState(false);

  const handleSOS = async () => {
    try {
      // TODO: Integrate with real emergency services API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send to emergency contacts
      user?.emergencyContacts.forEach(contact => {
        console.log(`Sending SOS to ${contact.name} at ${contact.phone}`);
      });

      setEmergencySent(true);
      toast.success('Emergency alert sent to your contacts and local authorities');
    } catch (error) {
      toast.error('Failed to send emergency alert');
    }
  };

  const generateShareLink = () => {
    if (!tripId) return '';
    const baseUrl = window.location.origin;
    return `${baseUrl}/track/${tripId}`;
  };

  const handleShareTrip = async () => {
    const shareLink = generateShareLink();
    
    try {
      await navigator.clipboard.writeText(shareLink);
      toast.success('Share link copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const handleShareViaWhatsApp = () => {
    const shareLink = generateShareLink();
    const message = `Hi! I'm sharing my ride with you for safety. Track my trip here: ${shareLink}\n\nDriver: ${driverName}\nFrom: ${from}\nTo: ${to}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="space-y-4">
      {/* SOS Button */}
      <Card className="border-red-200 bg-red-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-red-800">
            <AlertTriangle className="size-5" />
            {t('safety.sos')}
          </CardTitle>
          <CardDescription>
            Press this button only in case of emergency
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Dialog open={sosDialogOpen} onOpenChange={setSosDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" className="w-full" size="lg">
                <AlertTriangle className="size-5 mr-2" />
                Emergency SOS
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="text-red-600">Emergency Alert</DialogTitle>
                <DialogDescription>
                  This will immediately notify your emergency contacts and local authorities
                </DialogDescription>
              </DialogHeader>
              
              {emergencySent ? (
                <div className="space-y-4">
                  <Alert className="bg-green-50 border-green-200">
                    <Check className="size-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      Emergency alert sent successfully!
                    </AlertDescription>
                  </Alert>
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Notified contacts:</p>
                    {user?.emergencyContacts.map(contact => (
                      <div key={contact.id} className="flex items-center gap-2 text-sm">
                        <Check className="size-4 text-green-600" />
                        <span>{contact.name} - {contact.phone}</span>
                      </div>
                    ))}
                  </div>
                  <Button onClick={() => setSosDialogOpen(false)} className="w-full">
                    Close
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <Alert className="bg-red-50 border-red-200">
                    <AlertTriangle className="size-4 text-red-600" />
                    <AlertDescription className="text-red-800">
                      Are you sure you want to send an emergency alert?
                    </AlertDescription>
                  </Alert>
                  
                  {user?.emergencyContacts && user.emergencyContacts.length > 0 ? (
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Will notify:</p>
                      <div className="space-y-1">
                        {user.emergencyContacts.map(contact => (
                          <div key={contact.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Phone className="size-4" />
                            <span>{contact.name} ({contact.relationship})</span>
                          </div>
                        ))}
                      </div>
                      {currentLocation && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <MapPin className="size-4" />
                          <span>Your current location will be shared</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <Alert>
                      <AlertDescription>
                        No emergency contacts set. Add contacts in your profile settings.
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="flex gap-2">
                    <Button onClick={handleSOS} variant="destructive" className="flex-1">
                      Send Emergency Alert
                    </Button>
                    <Button onClick={() => setSosDialogOpen(false)} variant="outline" className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>

      {/* Share Trip */}
      {tripId && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="size-5 text-primary" />
              {t('safety.shareTrip')}
            </CardTitle>
            <CardDescription>
              Let trusted contacts track your trip in real-time
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Dialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" className="w-full">
                  <Share2 className="size-4 mr-2" />
                  Share Trip Details
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Share Trip</DialogTitle>
                  <DialogDescription>
                    Choose how you want to share your trip details
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                  <div>
                    <Label>Share Link</Label>
                    <div className="flex gap-2 mt-2">
                      <Input
                        value={generateShareLink()}
                        readOnly
                        className="flex-1"
                      />
                      <Button onClick={handleShareTrip} variant="outline" size="icon">
                        <Copy className="size-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button onClick={handleShareViaWhatsApp} variant="outline" className="w-full">
                      <svg className="size-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                      Share via WhatsApp
                    </Button>

                    <Button onClick={() => {
                      handleShareTrip();
                      setShareDialogOpen(false);
                    }} variant="default" className="w-full">
                      Copy Link
                    </Button>
                  </div>

                  <Alert>
                    <Shield className="size-4" />
                    <AlertDescription>
                      Recipients can track your location and trip progress in real-time
                    </AlertDescription>
                  </Alert>
                </div>
              </DialogContent>
            </Dialog>
          </CardContent>
        </Card>
      )}

      {/* Emergency Contacts */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="size-5 text-primary" />
            {t('safety.emergencyContacts')}
          </CardTitle>
          <CardDescription>
            {user?.emergencyContacts && user.emergencyContacts.length > 0
              ? `${user.emergencyContacts.length} contact(s) configured`
              : 'No emergency contacts configured'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {user?.emergencyContacts && user.emergencyContacts.length > 0 ? (
            <div className="space-y-2">
              {user.emergencyContacts.map(contact => (
                <div key={contact.id} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Users className="size-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                  </div>
                  <Phone className="size-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          ) : (
            <Button variant="outline" className="w-full">
              Add Emergency Contact
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
