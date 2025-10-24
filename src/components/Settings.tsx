import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Bell, Lock, Globe, Shield, HelpCircle, Trash2, LogOut } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Alert, AlertDescription } from './ui/alert';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

export function Settings() {
  const { user, updateProfile, logout } = useAuth();
  const { language, setLanguage } = useLanguage();
  const [notificationSettings, setNotificationSettings] = useState({
    tripUpdates: true,
    messages: true,
    payments: true,
    promotions: false,
    emailNotifications: true,
    pushNotifications: true,
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showPhone: false,
    showEmail: false,
    allowMessages: true,
  });

  const handleSaveProfile = () => {
    toast.success('Profile updated successfully!');
  };

  const handleDeleteAccount = () => {
    toast.error('Account deletion requested');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1>Settings</h1>
        <p className="text-muted-foreground">Manage your account preferences</p>
      </div>

      <Tabs defaultValue="profile">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="privacy">Privacy</TabsTrigger>
          <TabsTrigger value="language">Language</TabsTrigger>
          <TabsTrigger value="account">Account</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Profile Information
              </CardTitle>
              <CardDescription>Update your personal details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  <Input defaultValue={user?.name} />
                </div>
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input type="email" defaultValue={user?.email} />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Phone Number</Label>
                <Input type="tel" defaultValue={user?.phone || '+971 XX XXX XXXX'} />
              </div>

              <div className="space-y-2">
                <Label>Bio</Label>
                <Input placeholder="Tell us about yourself..." defaultValue={user?.bio} />
              </div>

              <div className="space-y-2">
                <Label>Driver License</Label>
                <Input placeholder="License number (for drivers)" />
              </div>

              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="size-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>Choose how you want to be notified</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Push Notifications</h3>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Trip Updates</p>
                    <p className="text-sm text-muted-foreground">Bookings, cancellations, and changes</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.tripUpdates}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, tripUpdates: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Messages</p>
                    <p className="text-sm text-muted-foreground">New chat messages</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.messages}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, messages: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Payments</p>
                    <p className="text-sm text-muted-foreground">Payment confirmations and receipts</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.payments}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, payments: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Promotions</p>
                    <p className="text-sm text-muted-foreground">Deals and special offers</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.promotions}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, promotions: checked })
                    }
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Other Channels</h3>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.emailNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, emailNotifications: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">SMS Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive alerts via text message</p>
                  </div>
                  <Switch 
                    checked={notificationSettings.pushNotifications}
                    onCheckedChange={(checked) => 
                      setNotificationSettings({ ...notificationSettings, pushNotifications: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="size-5" />
                Privacy & Safety
              </CardTitle>
              <CardDescription>Control your privacy settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Alert>
                <Shield className="size-4" />
                <AlertDescription>
                  Your safety is our priority. We never share your personal information without your permission.
                </AlertDescription>
              </Alert>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Public Profile</p>
                    <p className="text-sm text-muted-foreground">Make your profile visible to other users</p>
                  </div>
                  <Switch 
                    checked={privacySettings.profileVisible}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, profileVisible: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Phone Number</p>
                    <p className="text-sm text-muted-foreground">Display phone on confirmed trips only</p>
                  </div>
                  <Switch 
                    checked={privacySettings.showPhone}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, showPhone: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Show Email</p>
                    <p className="text-sm text-muted-foreground">Display email address on profile</p>
                  </div>
                  <Switch 
                    checked={privacySettings.showEmail}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, showEmail: checked })
                    }
                  />
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Allow Messages</p>
                    <p className="text-sm text-muted-foreground">Let other users contact you</p>
                  </div>
                  <Switch 
                    checked={privacySettings.allowMessages}
                    onCheckedChange={(checked) => 
                      setPrivacySettings({ ...privacySettings, allowMessages: checked })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Language Tab */}
        <TabsContent value="language" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="size-5" />
                Language & Region
              </CardTitle>
              <CardDescription>Choose your preferred language</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Display Language</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Button
                    variant={language === 'en' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setLanguage('en')}
                  >
                    🇬🇧 English
                  </Button>
                  <Button
                    variant={language === 'ar' ? 'default' : 'outline'}
                    className="justify-start"
                    onClick={() => setLanguage('ar')}
                  >
                    🇸🇦 العربية (Arabic)
                  </Button>
                </div>
              </div>

              <Alert>
                <Globe className="size-4" />
                <AlertDescription>
                  The app will automatically switch to {language === 'ar' ? 'right-to-left (RTL)' : 'left-to-right (LTR)'} layout based on your language preference.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab */}
        <TabsContent value="account" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="size-5" />
                Account Security
              </CardTitle>
              <CardDescription>Manage your account settings</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Change Password</Label>
                <div className="flex gap-2">
                  <Input type="password" placeholder="Current password" />
                  <Button variant="outline">Update</Button>
                </div>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Two-Factor Authentication</h3>
                <p className="text-sm text-muted-foreground mb-4">Add an extra layer of security to your account</p>
                <Button variant="outline">Enable 2FA</Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Active Sessions</h3>
                <p className="text-sm text-muted-foreground mb-4">Manage where you're logged in</p>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium">Current Device</p>
                      <p className="text-sm text-muted-foreground">Last active: Just now</p>
                    </div>
                    <Badge variant="outline">Active</Badge>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-destructive/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <Trash2 className="size-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Logout from All Devices</h3>
                <p className="text-sm text-muted-foreground mb-4">Sign out from all active sessions</p>
                <Button 
                  variant="outline" 
                  onClick={() => {
                    logout();
                    toast.success('Logged out from all devices');
                  }}
                >
                  <LogOut className="size-4 mr-2" />
                  Logout Everywhere
                </Button>
              </div>

              <Separator />

              <div>
                <h3 className="font-medium mb-2">Delete Account</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Permanently delete your account and all associated data
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="size-4 mr-2" />
                      Delete Account
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Are you absolutely sure?</DialogTitle>
                      <DialogDescription>
                        This action cannot be undone. This will permanently delete your account
                        and remove your data from our servers.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <Alert variant="destructive">
                        <AlertDescription>
                          Warning: All your trips, messages, and payment history will be permanently deleted.
                        </AlertDescription>
                      </Alert>
                      <div className="flex gap-2">
                        <Button variant="destructive" onClick={handleDeleteAccount}>
                          Yes, Delete My Account
                        </Button>
                        <DialogTrigger asChild>
                          <Button variant="outline">Cancel</Button>
                        </DialogTrigger>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
