"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Camera, Upload, Users } from "lucide-react"

export default function SettingsProfilePage() {
  const [username, setUsername] = useState("diper123")
  const [email, setEmail] = useState("psdiper@gmail.com")
  const [bio, setBio] = useState("")

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
      </div>

      {/* Navigation Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-7 mb-8">
          <TabsTrigger value="profile">
            Profile
          </TabsTrigger>
          <TabsTrigger value="stream">
            Stream URL and Key
          </TabsTrigger>
          <TabsTrigger value="security">
            Security
          </TabsTrigger>
          <TabsTrigger value="preferences">
            Preferences
          </TabsTrigger>
          <TabsTrigger value="notifications">
            Notifications
          </TabsTrigger>
          <TabsTrigger value="connections">
            Connections
          </TabsTrigger>
          <TabsTrigger value="developer">
            Developer
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-8">
          <div>
            <h2 className="text-2xl font-semibold mb-6">Profile</h2>

            {/* Profile Preview */}
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Profile Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-4 mb-6">
                  <Avatar className="w-16 h-16">
                    <AvatarImage src="/placeholder-user.jpg" alt="Profile" />
                    <AvatarFallback className="bg-blue-600 text-white">D</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="text-lg font-semibold text-white">About {username}</h3>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        <Users className="w-3 h-3 mr-1" />
                        0 Followers
                      </Badge>
                    </div>
                    <p className="text-gray-400">{username}'s Streamer Channel</p>
                  </div>
                </div>
                <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                  <Camera className="w-4 h-4 mr-2" />
                  Edit Avatar
                </Button>
              </CardContent>
            </Card>

            {/* Channel Banner */}
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Channel Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="w-full h-32 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 rounded-lg mb-4 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-200 via-purple-500 to-green-400 opacity-80"></div>
                  </div>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Banner Image
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  Minimum image size: 1200×134px and less than 4MB
                </p>
              </CardContent>
            </Card>

            {/* Offline Stream Banner */}
            <Card className="bg-gray-800 border-gray-700 mb-8">
              <CardHeader>
                <CardTitle className="text-white">Offline Stream Banner</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className="w-full h-64 bg-gray-900 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center">
                    <div className="text-center">
                      <div className="grid grid-cols-4 gap-1 mb-2">
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">O</div>
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">F</div>
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">F</div>
                        <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                      </div>
                      <div className="grid grid-cols-4 gap-1">
                        <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">L</div>
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">I</div>
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">N</div>
                      </div>
                      <div className="grid grid-cols-4 gap-1 mt-1">
                        <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                        <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                        <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">E</div>
                        <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                      </div>
                    </div>
                  </div>
                  <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                    <Upload className="w-4 h-4 mr-2" />
                    Update Banner Image
                  </Button>
                </div>
                <p className="text-sm text-gray-400">
                  This banner image will display for two minutes upon ending your stream. Must be 1080p (16:9 aspect ratio), in JPEG or PNG format and less than 4MB.
                </p>
              </CardContent>
            </Card>

            {/* Basic Details */}
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Basic Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-white">Username</Label>
                  <Input
                    id="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                  />
                  <p className="text-sm text-gray-400">
                    You need to enable 2FA to update your username.{" "}
                    <button className="text-white underline hover:text-green-400">
                      Click here to setup 2FA.
                    </button>
                  </p>
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Save changes
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bio" className="text-white">Bio</Label>
                  <Textarea
                    id="bio"
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[120px]"
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                      Cancel
                    </Button>
                    <Button className="bg-green-600 hover:bg-green-700 text-white">
                      Save changes
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Placeholder content for other tabs */}
        <TabsContent value="stream">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Stream URL and Key</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your streaming settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Stream settings content will go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Security</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your account security settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Security settings content will go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Preferences</CardTitle>
              <CardDescription className="text-gray-400">
                Customize your experience
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Preferences content will go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Notifications</CardTitle>
              <CardDescription className="text-gray-400">
                Configure your notification preferences
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Notifications content will go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="connections">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Connections</CardTitle>
              <CardDescription className="text-gray-400">
                Manage your connected accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Connections content will go here...</p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="developer">
          <Card className="bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Developer</CardTitle>
              <CardDescription className="text-gray-400">
                Developer tools and API settings
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-400">Developer settings content will go here...</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
                    </div>
                    <p className="text-sm text-gray-400">
                      Minimum image size: 1200×134px and less than 4MB
                    </p>
                  </CardContent>
                </Card>

                {/* Offline Stream Banner */}
                <Card className="bg-gray-800 border-gray-700 mb-8">
                  <CardHeader>
                    <CardTitle className="text-white">Offline Stream Banner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="mb-4">
                      <div className="w-full h-64 bg-gray-900 rounded-lg mb-4 relative overflow-hidden flex items-center justify-center">
                        <div className="text-center">
                          <div className="grid grid-cols-4 gap-1 mb-2">
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">O</div>
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">F</div>
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">F</div>
                            <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                          </div>
                          <div className="grid grid-cols-4 gap-1">
                            <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">L</div>
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">I</div>
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">N</div>
                          </div>
                          <div className="grid grid-cols-4 gap-1 mt-1">
                            <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                            <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                            <div className="w-12 h-12 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xl">E</div>
                            <div className="w-12 h-12 bg-green-400 rounded flex items-center justify-center text-black font-bold text-xl"></div>
                          </div>
                        </div>
                      </div>
                      <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                        <Upload className="w-4 h-4 mr-2" />
                        Update Banner Image
                      </Button>
                    </div>
                    <p className="text-sm text-gray-400">
                      This banner image will display for two minutes upon ending your stream. Must be 1080p (16:9 aspect ratio), in JPEG or PNG format and less than 4MB.
                    </p>
                  </CardContent>
                </Card>

                {/* Basic Details */}
                <Card className="bg-gray-800 border-gray-700">
                  <CardHeader>
                    <CardTitle className="text-white">Basic Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="username" className="text-white">Username</Label>
                      <Input
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                      />
                      <p className="text-sm text-gray-400">
                        You need to enable 2FA to update your username.{" "}
                        <button className="text-white underline hover:text-green-400">
                          Click here to setup 2FA.
                        </button>
                      </p>
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          Save changes
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-white">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-gray-700 border-gray-600 text-white focus:border-green-500"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-white">Bio</Label>
                      <Textarea
                        id="bio"
                        value={bio}
                        onChange={(e) => setBio(e.target.value)}
                        placeholder="Tell us about yourself..."
                        className="bg-gray-700 border-gray-600 text-white focus:border-green-500 min-h-[120px]"
                      />
                      <div className="flex justify-end space-x-2">
                        <Button variant="outline" className="border-gray-600 text-gray-300 hover:bg-gray-700">
                          Cancel
                        </Button>
                        <Button className="bg-green-600 hover:bg-green-700 text-white">
                          Save changes
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Placeholder content for other tabs */}
            <TabsContent value="stream">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Stream URL and Key</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your streaming settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Stream settings content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Security</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your account security settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Security settings content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="preferences">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Preferences</CardTitle>
                  <CardDescription className="text-gray-400">
                    Customize your experience
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Preferences content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Notifications</CardTitle>
                  <CardDescription className="text-gray-400">
                    Configure your notification preferences
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Notifications content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="connections">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Connections</CardTitle>
                  <CardDescription className="text-gray-400">
                    Manage your connected accounts
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Connections content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="developer">
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-white">Developer</CardTitle>
                  <CardDescription className="text-gray-400">
                    Developer tools and API settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-400">Developer settings content will go here...</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}