import { useState } from 'react'
import { User, Mail, Lock, Shield, Save, CheckCircle } from 'lucide-react'
import { useOutletContext } from 'react-router-dom'

export default function Settings() {
    const { user } = useOutletContext<any>()

    // Form states
    const [name, setName] = useState(user?.name || 'Admin User')
    const [email, setEmail] = useState(user?.email || 'admin@amul.com')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')

    // UI states
    const [isSaving, setIsSaving] = useState(false)
    const [successMessage, setSuccessMessage] = useState('')

    const handleSaveProfile = (e: React.FormEvent) => {
        e.preventDefault()
        setIsSaving(true)

        // Simulate API call
        setTimeout(() => {
            // Update the context user if there was a real state for it
            setIsSaving(false)
            setSuccessMessage('Profile information updated successfully.')

            // Clear passwords if they were attempting to change it
            setCurrentPassword('')
            setNewPassword('')
            setConfirmPassword('')

            // Hide message after 3 seconds
            setTimeout(() => setSuccessMessage(''), 3000)
        }, 800)
    }

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl shadow-sm border border-gray-100 animate-in fade-in duration-300">
            <div className="p-6 sm:p-8 border-b border-gray-100 flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-tr from-blue-100 to-blue-200 border-2 border-white shadow-lg rounded-full flex items-center justify-center text-amul-darkblue font-bold text-2xl relative">
                    {name.substring(0, 2).toUpperCase()}
                    <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                </div>
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 leading-tight">Account Settings</h2>
                    <p className="text-gray-500 mt-1 flex items-center text-sm">
                        <Shield className="w-4 h-4 mr-1 text-amul-darkblue" />
                        Administrator Role
                    </p>
                </div>
            </div>

            <div className="flex-1 overflow-auto p-6 sm:p-8">
                <div className="max-w-2xl mx-auto space-y-8">

                    {successMessage && (
                        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl flex items-center animate-in slide-in-from-top-2">
                            <CheckCircle className="w-5 h-5 mr-3 text-green-500" />
                            <p className="font-medium text-sm">{successMessage}</p>
                        </div>
                    )}

                    <form onSubmit={handleSaveProfile} className="space-y-6">

                        {/* Profile Section */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Profile Details</h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-shadow text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Email Address</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            required
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-shadow text-gray-900"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Section */}
                        <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-6">
                            <h3 className="text-lg font-bold text-gray-900 border-b border-gray-200 pb-2">Change Password</h3>
                            <p className="text-xs text-gray-500 mb-4 pb-2">Leave password fields blank if you do not wish to change your current password.</p>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1.5">Current Password</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                        <input
                                            type="password"
                                            value={currentPassword}
                                            onChange={(e) => setCurrentPassword(e.target.value)}
                                            placeholder="Enter current password"
                                            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-shadow text-gray-900"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                placeholder="New password"
                                                disabled={!currentPassword}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-shadow text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-1.5">Confirm New Password</label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                            <input
                                                type="password"
                                                value={confirmPassword}
                                                onChange={(e) => setConfirmPassword(e.target.value)}
                                                placeholder="Confirm password"
                                                disabled={!currentPassword}
                                                className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amul-darkblue/50 focus:border-amul-darkblue transition-shadow text-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-4">
                            <button
                                type="submit"
                                disabled={isSaving || (newPassword !== confirmPassword)}
                                className="flex items-center justify-center px-6 py-3 bg-amul-darkblue text-white rounded-xl font-bold shadow-md hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amul-darkblue transition-colors disabled:opacity-70 disabled:cursor-not-allowed min-w-[160px]"
                            >
                                {isSaving ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-5 h-5 mr-2" />
                                        Save Changes
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}
