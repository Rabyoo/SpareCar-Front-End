import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Save,
  Shield,
  Bell,
  Mail,
  Globe,
  CreditCard,
  Users,
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Eye,
  EyeOff,
  Loader2,
  Check,
} from "lucide-react";
import { toast } from "sonner";

export default function Settings() {
  // States منفصلة لكل حقل
  const [shopName, setShopName] = useState("Spare Car Shop");
  const [shopEmail, setShopEmail] = useState("admin@sparecar.com");
  const [currency, setCurrency] = useState("USD");
  const [timezone, setTimezone] = useState("UTC+2");
  const [shopDescription, setShopDescription] = useState("");
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    lowStock: true,
    newOrders: true,
  });
  const [security, setSecurity] = useState({
    twoFactor: false,
    sessionTimeout: 30,
  });
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // تحميل الإعدادات المحفوظة عند التحميل
  useEffect(() => {
    const loadSavedSettings = () => {
      try {
        const saved = localStorage.getItem("adminSettings");
        if (saved) {
          const parsed = JSON.parse(saved);

          setShopName(parsed.shopName || "Spare Car Shop");
          setShopEmail(parsed.shopEmail || "admin@sparecar.com");
          setCurrency(parsed.currency || "USD");
          setTimezone(parsed.timezone || "UTC+2");
          setShopDescription(parsed.shopDescription || "");
          setMaintenanceMode(parsed.maintenanceMode || false);
          setNotifications(
            parsed.notifications || {
              email: true,
              push: true,
              lowStock: true,
              newOrders: true,
            }
          );
          setSecurity(
            parsed.security || {
              twoFactor: false,
              sessionTimeout: 30,
            }
          );

          console.log("✅ Settings loaded successfully");
        }
      } catch (error) {
        console.error("❌ Error loading settings:", error);
        toast.error("Failed to load settings");
      }
    };

    loadSavedSettings();
  }, []);

  // تتبع التغييرات
  useEffect(() => {
    setHasUnsavedChanges(true);
  }, [
    shopName,
    shopEmail,
    currency,
    timezone,
    shopDescription,
    maintenanceMode,
    notifications,
    security,
    newPassword,
  ]);

  // دالة حفظ الإعدادات - محسّنة
  const handleSaveSettings = async () => {
    if (isSaving) return;

    setIsSaving(true);

    try {
      // التحقق من كلمة المرور إذا تم تغييرها
      if (newPassword) {
        if (newPassword.length < 6) {
          toast.error("Password must be at least 6 characters!");
          setIsSaving(false);
          return;
        }

        if (newPassword !== confirmPassword) {
          toast.error("Passwords don't match!");
          setIsSaving(false);
          return;
        }

        if (!currentPassword) {
          toast.error("Please enter your current password!");
          setIsSaving(false);
          return;
        }
      }

      // إنشاء كائن الإعدادات
      const allSettings = {
        shopName,
        shopEmail,
        currency,
        timezone,
        shopDescription,
        maintenanceMode,
        notifications,
        security: {
          ...security,
          passwordChanged: !!newPassword,
        },
        lastUpdated: new Date().toISOString(),
      };

      // حفظ في localStorage
      localStorage.setItem("adminSettings", JSON.stringify(allSettings));

      // إذا تم تغيير كلمة المرور، احفظها بشكل منفصل (مشفرة في تطبيق حقيقي)
      if (newPassword) {
        localStorage.setItem("adminPassword", newPassword);
        // مسح حقول كلمة المرور
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }

      console.log("✅ Settings saved:", allSettings);

      // عرض رسالة نجاح
      toast.success("Settings saved successfully!", {
        description: `Last updated: ${new Date().toLocaleTimeString()}`,
        duration: 3000,
        icon: <Check className="w-5 h-5 text-green-600" />,
      });

      setHasUnsavedChanges(false);
      setIsSaving(false);

      // لا تقم بعمل reload! فقط أعد تعيين حالة الحفظ
    } catch (error) {
      toast.error("Failed to save settings");
      console.error("❌ Save error:", error);
      setIsSaving(false);
    }
  };

  // دالة إعادة التعيين
  const handleResetSettings = () => {
    if (
      !confirm(
        "Are you sure you want to reset all settings to defaults? This cannot be undone."
      )
    ) {
      return;
    }

    const defaultSettings = {
      shopName: "Spare Car Shop",
      shopEmail: "admin@sparecar.com",
      currency: "USD",
      timezone: "UTC+2",
      shopDescription: "",
      maintenanceMode: false,
      notifications: {
        email: true,
        push: true,
        lowStock: true,
        newOrders: true,
      },
      security: {
        twoFactor: false,
        sessionTimeout: 30,
      },
    };

    setShopName(defaultSettings.shopName);
    setShopEmail(defaultSettings.shopEmail);
    setCurrency(defaultSettings.currency);
    setTimezone(defaultSettings.timezone);
    setShopDescription(defaultSettings.shopDescription);
    setMaintenanceMode(defaultSettings.maintenanceMode);
    setNotifications(defaultSettings.notifications);
    setSecurity(defaultSettings.security);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");

    localStorage.removeItem("adminSettings");
    localStorage.removeItem("adminPassword");

    toast.info("Settings reset to defaults", {
      description: "All changes have been reverted",
    });

    setHasUnsavedChanges(false);
  };

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "EGP", label: "Egyptian Pound (L.E)" },
    { value: "SAR", label: "Saudi Riyal (SR)" },
    { value: "AED", label: "UAE Dirham (AED)" },
  ];

  const timezones = [
    { value: "UTC+2", label: "Cairo (UTC+2)" },
    { value: "UTC", label: "UTC" },
    { value: "UTC+1", label: "London (UTC+1)" },
    { value: "UTC+3", label: "Moscow (UTC+3)" },
    { value: "UTC-5", label: "New York (UTC-5)" },
    { value: "UTC+8", label: "Singapore (UTC+8)" },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your shop settings and preferences
          </p>
        </div>
        {hasUnsavedChanges && (
          <div className="flex items-center gap-2 text-amber-600 bg-amber-50 px-4 py-2 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">Unsaved changes</span>
          </div>
        )}
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid grid-cols-5 w-full max-w-2xl">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            General
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
          <TabsTrigger value="users" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Team
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                General Settings
              </CardTitle>
              <CardDescription>
                Basic shop information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="shopName">Shop Name</Label>
                  <Input
                    id="shopName"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="Enter shop name"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="shopEmail">Contact Email</Label>
                  <Input
                    id="shopEmail"
                    type="email"
                    value={shopEmail}
                    onChange={(e) => setShopEmail(e.target.value)}
                    placeholder="shop@example.com"
                  />
                </div>
                <div className="space-y-3">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      {currencies.map((curr) => (
                        <SelectItem key={curr.value} value={curr.value}>
                          {curr.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-3">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Select value={timezone} onValueChange={setTimezone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz.value} value={tz.value}>
                          {tz.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-3">
                <Label htmlFor="shopDescription">Shop Description</Label>
                <Textarea
                  id="shopDescription"
                  value={shopDescription}
                  onChange={(e) => setShopDescription(e.target.value)}
                  placeholder="Describe your shop..."
                  rows={4}
                  className="resize-none"
                />
              </div>

              <div className="flex items-center justify-between p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-yellow-600" />
                  <div>
                    <p className="font-medium text-yellow-800">
                      Maintenance Mode
                    </p>
                    <p className="text-sm text-yellow-600">
                      Temporarily disable shop for maintenance
                    </p>
                  </div>
                </div>
                <Switch
                  checked={maintenanceMode}
                  onCheckedChange={setMaintenanceMode}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Settings */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Email Notifications</p>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.email}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        email: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Push Notifications</p>
                      <p className="text-sm text-gray-500">
                        Browser push notifications
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.push}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        push: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Low Stock Alerts</p>
                      <p className="text-sm text-gray-500">
                        When product stock is low
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.lowStock}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        lowStock: checked,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CreditCard className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">New Order Alerts</p>
                      <p className="text-sm text-gray-500">
                        When new orders are placed
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={notifications.newOrders}
                    onCheckedChange={(checked) =>
                      setNotifications({
                        ...notifications,
                        newOrders: checked,
                      })
                    }
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5" />
                Security Settings
              </CardTitle>
              <CardDescription>Manage your account security</CardDescription>
            </CardHeader>
            <CardContent className="space-y-8">
              {/* Password Change */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Change Password</h3>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? (
                      <EyeOff className="w-4 h-4 mr-2" />
                    ) : (
                      <Eye className="w-4 h-4 mr-2" />
                    )}
                    {showPassword ? "Hide" : "Show"} Passwords
                  </Button>
                </div>

                <div className="space-y-4">
                  <div className="space-y-3">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type={showPassword ? "text" : "password"}
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      placeholder="Enter current password"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        type={showPassword ? "text" : "password"}
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Enter new password"
                      />
                    </div>
                    <div className="space-y-3">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        type={showPassword ? "text" : "password"}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                      />
                    </div>
                  </div>

                  {newPassword && (
                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <p className="font-medium mb-1">Password requirements:</p>
                      <ul className="list-disc list-inside space-y-1">
                        <li
                          className={
                            newPassword.length >= 6
                              ? "text-green-600"
                              : "text-gray-600"
                          }>
                          At least 6 characters
                        </li>
                        <li
                          className={
                            newPassword === confirmPassword && confirmPassword
                              ? "text-green-600"
                              : "text-gray-600"
                          }>
                          Passwords match
                        </li>
                      </ul>
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              {/* Two-Factor Authentication */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-medium">Two-Factor Authentication</p>
                      <p className="text-sm text-gray-500">
                        Add extra security to your account
                      </p>
                    </div>
                  </div>
                  <Switch
                    checked={security.twoFactor}
                    onCheckedChange={(checked) =>
                      setSecurity({
                        ...security,
                        twoFactor: checked,
                      })
                    }
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="sessionTimeout">
                    Session Timeout (minutes)
                  </Label>
                  <Select
                    value={security.sessionTimeout.toString()}
                    onValueChange={(value) =>
                      setSecurity({
                        ...security,
                        sessionTimeout: parseInt(value),
                      })
                    }>
                    <SelectTrigger>
                      <SelectValue placeholder="Select timeout" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="15">15 minutes</SelectItem>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">1 hour</SelectItem>
                      <SelectItem value="120">2 hours</SelectItem>
                      <SelectItem value="240">4 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing Settings */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Billing & Subscription
              </CardTitle>
              <CardDescription>
                Manage your billing and subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">
                  Billing features coming soon
                </p>
                <p className="text-sm text-gray-400">
                  Manage subscriptions, invoices, and payment methods
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Team Settings */}
        <TabsContent value="users" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Team Management
              </CardTitle>
              <CardDescription>
                Manage team members and permissions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Users className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                <p className="text-gray-500 mb-2">
                  Team management features coming soon
                </p>
                <p className="text-sm text-gray-400">
                  Invite team members and manage their roles
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Action Buttons - Fixed at bottom */}
      <div className="sticky bottom-0 bg-white border-t border-gray-200 p-4 -mx-6 -mb-6 mt-6">
        <div className="flex flex-col sm:flex-row gap-3 justify-end max-w-7xl mx-auto">
          <Button
            variant="outline"
            onClick={handleResetSettings}
            className="flex items-center gap-2"
            disabled={isSaving}>
            <RefreshCw className="w-4 h-4" />
            Reset to Defaults
          </Button>
          <Button
            onClick={handleSaveSettings}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
            disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Save All Changes
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
