// frontend/src/pages/vendor/VendorSettings.tsx
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Settings,
  Shield,
  CreditCard,
  Truck,
  Upload,
  Save,
  Bell,
} from "lucide-react";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@radix-ui/react-select";

export default function VendorSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState({
    general: {
      storeName: "",
      storeDescription: "",
      contactEmail: "",
      phoneNumber: "",
      website: "",
      address: {
        street: "",
        city: "",
        state: "",
        country: "",
        postalCode: "",
      },
    },
    notifications: {
      emailNotifications: true,
      newOrderNotification: true,
      lowStockNotification: true,
      reviewNotification: true,
      marketingEmails: false,
    },
    shipping: {
      shippingPolicy: "",
      returnPolicy: "",
      processingTime: "1-2 business days",
      freeShippingThreshold: 0,
      shippingZones: [],
    },
    payment: {
      payoutMethod: "bank_transfer",
      bankDetails: {
        accountName: "",
        accountNumber: "",
        bankName: "",
        swiftCode: "",
      },
      commissionRate: 10,
      taxId: "",
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 30,
      loginAlerts: true,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/settings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      const data = await response.json();
      if (data.success) {
        setSettings(data.settings);
      }
    } catch (error) {
      console.error("Error fetching settings:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/vendor/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(settings),
        },
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Settings saved successfully");
      } else {
        toast.error(data.message || "Failed to save settings");
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-orange-200 border-t-orange-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Store Settings
              </h1>
              <p className="text-gray-600">
                Manage your store configuration and preferences
              </p>
            </div>
            <Button
              onClick={handleSave}
              className={`bg-orange-500 hover:bg-orange-600 flex items-center justify-center ${
                saving ? "opacity-70 cursor-not-allowed" : ""
              }`}
              disabled={saving}>
              {saving ? (
                <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2" />
              ) : (
                <Save className="w-4 h-4 mr-2" />
              )}
              Save Changes
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8">
          {/* Tabs Navigation */}
          <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 bg-gray-100 p-1">
            <TabsTrigger
              value="general"
              className="data-[state=active]:bg-white">
              <Settings className="w-4 h-4 mr-2" />
              General
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="data-[state=active]:bg-white">
              <Bell className="w-4 h-4 mr-2" />
              Notifications
            </TabsTrigger>
            <TabsTrigger
              value="shipping"
              className="data-[state=active]:bg-white">
              <Truck className="w-4 h-4 mr-2" />
              Shipping
            </TabsTrigger>
            <TabsTrigger
              value="payment"
              className="data-[state=active]:bg-white">
              <CreditCard className="w-4 h-4 mr-2" />
              Payment
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="data-[state=active]:bg-white">
              <Shield className="w-4 h-4 mr-2" />
              Security
            </TabsTrigger>
          </TabsList>

          {/* General Settings */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Store Information</CardTitle>
                <CardDescription>
                  Update your store details and contact information
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Store Name *</Label>
                    <Input
                      value={settings.general.storeName}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            storeName: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Contact Email *</Label>
                    <Input
                      type="email"
                      value={settings.general.contactEmail}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            contactEmail: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>

                <div>
                  <Label>Store Description</Label>
                  <Textarea
                    value={settings.general.storeDescription}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        general: {
                          ...settings.general,
                          storeDescription: e.target.value,
                        },
                      })
                    }
                    rows={3}
                    placeholder="Describe your store for customers..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Phone Number</Label>
                    <Input
                      value={settings.general.phoneNumber}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            phoneNumber: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Website</Label>
                    <Input
                      value={settings.general.website}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            website: e.target.value,
                          },
                        })
                      }
                      placeholder="https://example.com"
                    />
                  </div>
                </div>

                <div>
                  <Label className="mb-3 block">Store Address</Label>
                  <div className="space-y-4">
                    <Input
                      placeholder="Street Address"
                      value={settings.general.address.street}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          general: {
                            ...settings.general,
                            address: {
                              ...settings.general.address,
                              street: e.target.value,
                            },
                          },
                        })
                      }
                    />
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Input
                        placeholder="City"
                        value={settings.general.address.city}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              address: {
                                ...settings.general.address,
                                city: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="State"
                        value={settings.general.address.state}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              address: {
                                ...settings.general.address,
                                state: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="Postal Code"
                        value={settings.general.address.postalCode}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              address: {
                                ...settings.general.address,
                                postalCode: e.target.value,
                              },
                            },
                          })
                        }
                      />
                      <Input
                        placeholder="Country"
                        value={settings.general.address.country}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            general: {
                              ...settings.general,
                              address: {
                                ...settings.general.address,
                                country: e.target.value,
                              },
                            },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Store Logo & Banner */}
            <Card>
              <CardHeader>
                <CardTitle>Store Branding</CardTitle>
                <CardDescription>
                  Upload your store logo and banner image
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <Label>Store Logo</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload Logo</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Recommended: 400x400px • Max 2MB
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <Label>Store Banner</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                      <Upload className="w-10 h-10 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-600 mb-2">Upload Banner</p>
                      <p className="text-sm text-gray-500 mb-4">
                        Recommended: 1200x300px • Max 5MB
                      </p>
                      <Button variant="outline">Choose File</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Settings */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose which notifications you want to receive
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Email Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive notifications via email
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          emailNotifications: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      New Order Notifications
                    </Label>
                    <p className="text-sm text-gray-600">
                      Get notified when you receive new orders
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.newOrderNotification}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          newOrderNotification: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Low Stock Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Get alerts when products are running low
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.lowStockNotification}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          lowStockNotification: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Review Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get notified when customers leave reviews
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.reviewNotification}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          reviewNotification: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Marketing Emails</Label>
                    <p className="text-sm text-gray-600">
                      Receive marketing and promotional emails
                    </p>
                  </div>
                  <Switch
                    checked={settings.notifications.marketingEmails}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          marketingEmails: checked,
                        },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Settings</CardTitle>
                <CardDescription>
                  Configure your shipping policies and rates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Processing Time</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    How long it takes to prepare orders for shipping
                  </p>
                  <Input
                    value={settings.shipping.processingTime}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          processingTime: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Free Shipping Threshold</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Minimum order amount for free shipping (set 0 to disable)
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-gray-600">$</span>
                    <Input
                      type="number"
                      value={settings.shipping.freeShippingThreshold}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          shipping: {
                            ...settings.shipping,
                            freeShippingThreshold: Number(e.target.value), // ⭐ تحويل لـ number
                          },
                        })
                      }
                      className="flex-1"
                    />
                  </div>
                </div>

                <div>
                  <Label>Shipping Policy</Label>
                  <Textarea
                    value={settings.shipping.shippingPolicy}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          shippingPolicy: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    placeholder="Describe your shipping policies..."
                  />
                </div>

                <div>
                  <Label>Return Policy</Label>
                  <Textarea
                    value={settings.shipping.returnPolicy}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        shipping: {
                          ...settings.shipping,
                          returnPolicy: e.target.value,
                        },
                      })
                    }
                    rows={4}
                    placeholder="Describe your return and refund policies..."
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Payment & Payout Settings</CardTitle>
                <CardDescription>
                  Configure how you receive payments and payouts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Commission Rate</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Platform commission percentage on each sale
                  </p>
                  <div className="flex items-center gap-2">
                    <Input
                      type="number"
                      value={settings.payment.commissionRate}
                      onChange={(e) =>
                        setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment,
                            commissionRate: Number(e.target.value), // تحويل إلى number
                          },
                        })
                      }
                      className="w-24"
                    />
                    <span className="text-gray-600">%</span>
                  </div>
                </div>

                <div>
                  <Label>Tax ID / VAT Number</Label>
                  <Input
                    value={settings.payment.taxId}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        payment: { ...settings.payment, taxId: e.target.value },
                      })
                    }
                    placeholder="Enter your tax identification number"
                  />
                </div>

                <div>
                  <Label className="mb-3 block">Payout Method</Label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        settings.payment.payoutMethod === "bank_transfer"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment,
                            payoutMethod: "bank_transfer",
                          },
                        })
                      }>
                      <div className="font-medium mb-1">Bank Transfer</div>
                      <p className="text-sm text-gray-600">
                        Direct bank deposit
                      </p>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        settings.payment.payoutMethod === "paypal"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment,
                            payoutMethod: "paypal",
                          },
                        })
                      }>
                      <div className="font-medium mb-1">PayPal</div>
                      <p className="text-sm text-gray-600">PayPal transfer</p>
                    </div>
                    <div
                      className={`border rounded-lg p-4 cursor-pointer ${
                        settings.payment.payoutMethod === "stripe"
                          ? "border-orange-500 bg-orange-50"
                          : "border-gray-300"
                      }`}
                      onClick={() =>
                        setSettings({
                          ...settings,
                          payment: {
                            ...settings.payment, // ✅ صح هنا
                            payoutMethod: "stripe",
                          },
                        })
                      }>
                      <div className="font-medium mb-1">Stripe</div>
                      <p className="text-sm text-gray-600">Stripe Connect</p>
                    </div>
                  </div>

                  {settings.payment.payoutMethod === "bank_transfer" && (
                    <div className="space-y-4 border-t pt-6">
                      <h4 className="font-medium">Bank Details</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label>Account Name</Label>
                          <Input
                            value={settings.payment.bankDetails.accountName}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                payment: {
                                  ...settings.payment,
                                  bankDetails: {
                                    ...settings.payment.bankDetails,
                                    accountName: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Account Number</Label>
                          <Input
                            value={settings.payment.bankDetails.accountNumber}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                payment: {
                                  ...settings.payment,
                                  bankDetails: {
                                    ...settings.payment.bankDetails,
                                    accountNumber: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>Bank Name</Label>
                          <Input
                            value={settings.payment.bankDetails.bankName}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                payment: {
                                  ...settings.payment,
                                  bankDetails: {
                                    ...settings.payment.bankDetails,
                                    bankName: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                        <div>
                          <Label>SWIFT/BIC Code</Label>
                          <Input
                            value={settings.payment.bankDetails.swiftCode}
                            onChange={(e) =>
                              setSettings({
                                ...settings,
                                payment: {
                                  ...settings.payment,
                                  bankDetails: {
                                    ...settings.payment.bankDetails,
                                    swiftCode: e.target.value,
                                  },
                                },
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Manage your account security and privacy
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">
                      Two-Factor Authentication
                    </Label>
                    <p className="text-sm text-gray-600">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          twoFactorAuth: checked,
                        },
                      })
                    }
                  />
                </div>

                <div>
                  <Label>Session Timeout</Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Automatic logout after inactivity
                  </p>
                  <div className="flex items-center gap-2">
                    <Select
                      value={settings.security.sessionTimeout.toString()}
                      onValueChange={(value) =>
                        setSettings({
                          ...settings,
                          security: {
                            ...settings.security,
                            sessionTimeout: parseInt(value),
                          },
                        })
                      }>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="15">15 minutes</SelectItem>
                        <SelectItem value="30">30 minutes</SelectItem>
                        <SelectItem value="60">1 hour</SelectItem>
                        <SelectItem value="120">2 hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label className="font-medium">Login Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Get notified of new logins to your account
                    </p>
                  </div>
                  <Switch
                    checked={settings.security.loginAlerts}
                    onCheckedChange={(checked) =>
                      setSettings({
                        ...settings,
                        security: {
                          ...settings.security,
                          loginAlerts: checked,
                        },
                      })
                    }
                  />
                </div>

                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">Danger Zone</h4>
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      Change Password
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50">
                      Download Account Data
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full justify-start">
                      Deactivate Account
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
