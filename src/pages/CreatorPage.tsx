import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Lock,
  Unlock,
  Sparkles,
  Plus,
  Trash2,
  Eye,
  CheckCircle,
  Copy,
  Check,
  ShieldCheck,
  ShieldAlert,
  Layers,
  LogOut,
  FileCode,
  ArrowLeft,
  LogIn,
  AlertTriangle,
  Upload,
  Film,
  X,
  Database,
  BadgeCheck,
  Pencil,
} from 'lucide-react';
import { usePrompts } from '../context/PromptsContext';
import { uploadMediaToSupabase } from '../lib/supabase';
import { categories } from '../data/prompts';
import { PromptCard } from '../components/PromptCard';
import { PromptItem } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth, useUser, useClerk, SignInButton } from '@clerk/react';

// Strict authorized credentials specified by owner
export const AUTHORIZED_CREATOR_EMAIL = 'aniketkhatkhede123@gmail.com';
export const CREATOR_PASSKEY = '9970@Aniket';

export const CreatorPage: React.FC = () => {
  const { prompts, isSupabaseLive, addPrompt, updatePrompt, deletePrompt, resetPrompts } = usePrompts();
  const { isSignedIn, isLoaded } = useAuth();
  const { user } = useUser();
  const { signOut } = useClerk();

  // Check if current user is aniketkhatkhede123@gmail.com
  const userPrimaryEmail = user?.primaryEmailAddress?.emailAddress?.toLowerCase().trim();
  const allUserEmails = user?.emailAddresses?.map((e) => e.emailAddress.toLowerCase().trim()) || [];
  const isAuthorizedEmail =
    isSignedIn &&
    (userPrimaryEmail === AUTHORIZED_CREATOR_EMAIL.toLowerCase() ||
      allUserEmails.includes(AUTHORIZED_CREATOR_EMAIL.toLowerCase()));

  // Passkey verification state stored in sessionStorage
  const [isPasskeyVerified, setIsPasskeyVerified] = useState<boolean>(() => {
    return sessionStorage.getItem('ps_creator_passkey_verified') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  // Active Tab: 'upload' | 'manage' | 'code-export'
  const [activeTab, setActiveTab] = useState<'upload' | 'manage' | 'code-export'>('upload');

  // Form State
  const [editingPromptId, setEditingPromptId] = useState<string | null>(null);
  const [creatorName, setCreatorName] = useState<string>(() => localStorage.getItem('ps_creator_name') || 'PROMPT STUDIO');
  const [creatorHandle, setCreatorHandle] = useState<string>(() => localStorage.getItem('ps_creator_handle') || 'promptstudio');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState(categories[0]?.id || 'ai');
  const [model, setModel] = useState('AI APP');
  const [typeLabel, setTypeLabel] = useState('Interactive App');
  const [isFree, setIsFree] = useState(true);
  const [price, setPrice] = useState('19');
  const [previewVideo, setPreviewVideo] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [videoSourceMode, setVideoSourceMode] = useState<'device' | 'url'>('device');
  const [uploadedVideoName, setUploadedVideoName] = useState<string>('');
  const [selectedVideoFile, setSelectedVideoFile] = useState<File | null>(null);
  const [videoLoading, setVideoLoading] = useState<boolean>(false);
  const [imageSourceMode, setImageSourceMode] = useState<'device' | 'url'>('url');
  const [uploadedImageName, setUploadedImageName] = useState<string>('');
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState<boolean>(false);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedVideoFile(file);
    setVideoLoading(true);
    setUploadedVideoName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setPreviewVideo(dataUrl);
      setVideoLoading(false);
    };
    reader.onerror = () => {
      alert('Error reading video file. Please try another file.');
      setVideoLoading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setSelectedImageFile(file);
    setUploadedImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setImageUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const [promptTemplate, setPromptTemplate] = useState('');
  const [isPopular, setIsPopular] = useState(true);

  // Key Features
  const [feat1Title, setFeat1Title] = useState('High-Performance UI');
  const [feat1Sub, setFeat1Sub] = useState('Optimized components and state flow.');
  const [feat2Title, setFeat2Title] = useState('Clean Architecture');
  const [feat2Sub, setFeat2Sub] = useState('Modular, production-ready code structure.');
  const [feat3Title, setFeat3Title] = useState('One-Click Deploy');
  const [feat3Sub, setFeat3Sub] = useState('Ready for Vercel, Netlify, or custom stack.');

  // Notification / Success
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copiedCode, setCopiedCode] = useState(false);

  const handleStartEdit = (p: PromptItem) => {
    setEditingPromptId(p.id);
    setTitle(p.title);
    setDescription(p.description);
    setCategory(p.category);
    setModel(p.model);
    setTypeLabel(p.typeLabel || 'Interactive App');
    setIsFree(p.price === 'Free');
    setPrice(typeof p.price === 'number' ? String(p.price) : '19');
    setPreviewVideo(p.previewVideo || '');
    setImageUrl(p.imageUrl || '');
    setPromptTemplate(p.promptTemplate || '');
    setIsPopular(p.isPopular ?? true);
    setCreatorName(p.creator.name);
    setCreatorHandle(p.creator.handle.replace(/^@+/, ''));
    if (p.keyFeatures && p.keyFeatures.length > 0) {
      if (p.keyFeatures[0]) {
        setFeat1Title(p.keyFeatures[0].title);
        setFeat1Sub(p.keyFeatures[0].subtitle);
      }
      if (p.keyFeatures[1]) {
        setFeat2Title(p.keyFeatures[1].title);
        setFeat2Sub(p.keyFeatures[1].subtitle);
      }
      if (p.keyFeatures[2]) {
        setFeat3Title(p.keyFeatures[2].title);
        setFeat3Sub(p.keyFeatures[2].subtitle);
      }
    }
    setActiveTab('upload');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCancelEdit = () => {
    setEditingPromptId(null);
    setTitle('');
    setDescription('');
    setPromptTemplate('');
    setPreviewVideo('');
    setImageUrl('');
    setUploadedVideoName('');
    setUploadedImageName('');
    setSelectedVideoFile(null);
    setSelectedImageFile(null);
  };

  const handleVerifyPasskey = (e: React.FormEvent) => {
    e.preventDefault();
    if (passkeyInput === CREATOR_PASSKEY) {
      setIsPasskeyVerified(true);
      sessionStorage.setItem('ps_creator_passkey_verified', 'true');
      setPasskeyError(false);
    } else {
      setPasskeyError(true);
    }
  };

  const handleLockSession = () => {
    setIsPasskeyVerified(false);
    sessionStorage.removeItem('ps_creator_passkey_verified');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !promptTemplate.trim()) {
      alert('Please fill in Title, Description, and Prompt Template.');
      return;
    }

    setIsPublishing(true);

    try {
      let finalVideoUrl = previewVideo.trim() || undefined;
      let finalImageUrl = imageUrl.trim() || undefined;

      // 1. Upload video file to Supabase Storage if picked from device
      if (selectedVideoFile) {
        const { url: supabaseVideoUrl, error: videoUploadError } = await uploadMediaToSupabase(
          selectedVideoFile,
          'videos'
        );
        if (supabaseVideoUrl) {
          finalVideoUrl = supabaseVideoUrl;
        } else if (videoUploadError) {
          console.warn('Supabase storage upload notice (using fallback preview):', videoUploadError);
        }
      }

      // 2. Upload image file to Supabase Storage if picked from device
      if (selectedImageFile) {
        const { url: supabaseImageUrl } = await uploadMediaToSupabase(
          selectedImageFile,
          'images'
        );
        if (supabaseImageUrl) {
          finalImageUrl = supabaseImageUrl;
        }
      }

      const keyFeatures = [
        { title: feat1Title, subtitle: feat1Sub, icon: 'Sparkles' },
        { title: feat2Title, subtitle: feat2Sub, icon: 'Layers' },
        { title: feat3Title, subtitle: feat3Sub, icon: 'Zap' },
      ];

      const safeCreatorName = creatorName.trim() || 'PROMPT STUDIO';
      const safeCreatorHandle = creatorHandle.trim().replace(/^@+/, '') || 'promptstudio';
      const customCreator = {
        name: safeCreatorName,
        handle: safeCreatorHandle,
        avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${safeCreatorHandle}&backgroundColor=1a1a18`,
        followers: 'Official Studio',
        isVerified: true,
      };

      // 3. Save or Update prompt record in Supabase database
      if (editingPromptId) {
        await updatePrompt(editingPromptId, {
          title: title.trim(),
          description: description.trim(),
          category: category,
          model: model.trim() || 'AI APP',
          typeLabel: typeLabel.trim() || 'Web App',
          price: isFree ? 'Free' : (parseFloat(price) || 19),
          previewVideo: finalVideoUrl,
          imageUrl: finalImageUrl,
          promptTemplate: promptTemplate.trim(),
          isPopular,
          keyFeatures,
          creator: customCreator,
        });

        setSuccessMessage(`Prompt "${title.trim()}" successfully updated!`);
        setTimeout(() => setSuccessMessage(null), 5000);
        handleCancelEdit();
        setActiveTab('manage');
        return;
      }

      const newPrompt = await addPrompt({
        title: title.trim(),
        description: description.trim(),
        category: category,
        model: model.trim() || 'AI APP',
        typeLabel: typeLabel.trim() || 'Web App',
        price: isFree ? 'Free' : (parseFloat(price) || 19),
        previewVideo: finalVideoUrl,
        imageUrl: finalImageUrl,
        promptTemplate: promptTemplate.trim(),
        isPopular,
        keyFeatures,
        creator: customCreator,
      });

      setSuccessMessage(`Prompt "${newPrompt.title}" & video successfully saved to Supabase backend!`);
      setTimeout(() => setSuccessMessage(null), 5000);

      // Reset Form
      setTitle('');
      setDescription('');
      setPromptTemplate('');
      setPreviewVideo('');
      setImageUrl('');
      setUploadedVideoName('');
      setUploadedImageName('');
      setSelectedVideoFile(null);
      setSelectedImageFile(null);
      setActiveTab('manage');
    } catch (err: any) {
      alert(`Error saving prompt: ${err?.message || 'Unknown error'}`);
    } finally {
      setIsPublishing(false);
    }
  };

  // Preview Prompt Object for Live Card
  const livePreviewPrompt: PromptItem = {
    id: 'preview-draft',
    title: title || 'Your Prompt Title Here',
    description: description || 'Enter your prompt summary to see how it renders in real-time across the marketplace.',
    model: model || 'AI APP',
    typeLabel: typeLabel || 'Interactive App',
    creator: {
      name: creatorName.trim() || 'PROMPT STUDIO',
      handle: creatorHandle.trim().replace(/^@+/, '') || 'promptstudio',
      avatarUrl: `https://api.dicebear.com/7.x/identicon/svg?seed=${creatorHandle.trim().replace(/^@+/, '') || 'promptstudio'}&backgroundColor=1a1a18`,
      followers: 'Official Studio',
      isVerified: true,
    },
    price: isFree ? 'Free' : (parseFloat(price) || 19),
    category: category,
    previewVideo: previewVideo || undefined,
    imageUrl: imageUrl || (!previewVideo ? 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80' : undefined),
    rating: 5.0,
    reviewsCount: 0,
    downloads: '1',
    uses: '1',
    likes: 1,
    isPopular: isPopular,
    isRecent: true,
  };

  // Generates copyable TypeScript code snippet for src/data/prompts.ts
  const generateExportCode = () => {
    return `// Exported Prompts from Creator Studio\n// Paste this into src/data/prompts.ts\n\nexport const promptItems: PromptItem[] = ${JSON.stringify(prompts, null, 2)};`;
  };

  // 1. Loading State
  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#1A1A18] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // 2. CHECK 1: User Not Signed In
  if (!isSignedIn) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E9F0] p-8 card-shadow relative z-10 text-center">
          <div className="w-14 h-14 bg-[#1A1A18] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
            <ShieldAlert className="w-3.5 h-3.5" /> Administrator Only
          </span>

          <h1 className="font-display text-2xl font-extrabold text-[#1A1A18] mb-2">
            Creator Studio Restricted
          </h1>
          <p className="text-sm text-[#6B6D75] mb-8 leading-relaxed">
            This portal is strictly restricted to the administrator account (<strong className="text-[#1A1A18]">{AUTHORIZED_CREATOR_EMAIL}</strong>). Please sign in with your administrator account.
          </p>

          <SignInButton mode="modal">
            <button
              type="button"
              className="w-full py-3.5 bg-[#1A1A18] hover:bg-[#333333] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In with {AUTHORIZED_CREATOR_EMAIL}</span>
            </button>
          </SignInButton>

          <div className="mt-8 pt-6 border-t border-[#F0F1F6] flex items-center justify-between text-xs text-[#8B8E9A]">
            <Link to="/" className="hover:text-[#1A1A18] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
            <span className="font-medium text-[#B0B3BC]">PROMPT STUDIO</span>
          </div>
        </div>
      </div>
    );
  }

  // 3. CHECK 2: Signed In, But Wrong Account
  if (!isAuthorizedEmail) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="max-w-md w-full bg-white rounded-3xl border border-rose-200 p-8 card-shadow relative z-10 text-center">
          <div className="w-14 h-14 bg-rose-50 text-rose-600 border border-rose-200 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
            <AlertTriangle className="w-6 h-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-rose-50 text-rose-700 border border-rose-200 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
            Access Denied
          </span>

          <h1 className="font-display text-2xl font-extrabold text-[#1A1A18] mb-2">
            Unauthorized Account
          </h1>
          <p className="text-sm text-[#6B6D75] mb-4 leading-relaxed">
            You are signed in as: <br />
            <strong className="text-rose-600 font-mono text-xs">{userPrimaryEmail || 'Unknown Email'}</strong>
          </p>
          <p className="text-xs text-[#8B8E9A] mb-8 leading-relaxed">
            Creator Studio is exclusively locked to <strong className="text-[#1A1A18]">{AUTHORIZED_CREATOR_EMAIL}</strong>. You do not have permission to access or upload prompts.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => signOut()}
              className="w-full py-3.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out & Switch Account</span>
            </button>

            <Link
              to="/"
              className="w-full py-3 bg-[#F7F8FC] hover:bg-[#EEF0F5] text-[#1A1A18] rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Return to Homepage</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 4. CHECK 3: Authorized Email, But Passkey Not Yet Verified
  if (!isPasskeyVerified) {
    return (
      <div className="min-h-screen bg-[#FFFEFB] flex items-center justify-center px-6 py-20 relative">
        <div className="absolute inset-0 dot-grid opacity-30 pointer-events-none" />

        <div className="max-w-md w-full bg-white rounded-3xl border border-[#E8E9F0] p-8 card-shadow relative z-10 text-center">
          <div className="w-14 h-14 bg-[#1A1A18] text-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-md">
            <Lock className="w-6 h-6" />
          </div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-xs font-bold tracking-wider uppercase mb-3">
            <ShieldCheck className="w-3.5 h-3.5" /> Account Verified
          </span>

          <h1 className="font-display text-2xl font-extrabold text-[#1A1A18] mb-1">
            Welcome, Aniket
          </h1>
          <p className="text-xs font-mono text-emerald-600 font-semibold mb-4">
            {AUTHORIZED_CREATOR_EMAIL}
          </p>
          <p className="text-sm text-[#6B6D75] mb-8 leading-relaxed">
            Please enter your creator passkey to unlock the Prompt Studio publishing environment.
          </p>

          <form onSubmit={handleVerifyPasskey} className="space-y-4">
            <div>
              <input
                type="password"
                placeholder="Enter Passkey..."
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setPasskeyError(false);
                }}
                className={`w-full px-4 py-3.5 rounded-xl border text-center text-lg tracking-widest font-mono font-bold transition-all outline-none ${
                  passkeyError
                    ? 'border-rose-400 bg-rose-50/50 text-rose-600 focus:ring-2 focus:ring-rose-200'
                    : 'border-[#E8E9F0] focus:border-[#1A1A18] focus:ring-2 focus:ring-[#1A1A18]/10'
                }`}
                autoFocus
              />
              {passkeyError && (
                <p className="text-xs text-rose-600 font-bold mt-2 text-center">
                  Incorrect passkey. Please enter the correct passkey.
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-[#1A1A18] hover:bg-[#333333] text-white rounded-xl font-bold text-sm tracking-wide transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Creator Studio</span>
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-[#F0F1F6] flex items-center justify-between text-xs text-[#8B8E9A]">
            <Link to="/" className="hover:text-[#1A1A18] flex items-center gap-1 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Website
            </Link>
            <button
              onClick={() => signOut()}
              className="hover:text-rose-600 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 5. UNLOCKED CREATOR STUDIO (Authorized Email + Correct Passkey)
  return (
    <div className="min-h-screen bg-[#FFFEFB] pt-6 sm:pt-8 pb-24 sm:pb-32">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        
        {/* Top Control Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 sm:pb-8 mb-6 sm:mb-8 border-b border-[#E8E9F0]">
          <div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="w-8 h-8 rounded-lg bg-[#1A1A18] text-white flex items-center justify-center text-xs font-bold shrink-0">
                PS
              </span>
              <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-extrabold text-[#1A1A18]">
                Creator Studio Dashboard
              </h1>
              <span className="px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1">
                <CheckCircle className="w-3 h-3" /> Aniket Verified
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1 border ${
                isSupabaseLive
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                <Database className="w-3 h-3" />
                {isSupabaseLive ? 'Supabase Connected' : 'Offline Cache'}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#6B6D75] mt-1.5 break-all">
              Logged in as <strong className="text-[#1A1A18]">{AUTHORIZED_CREATOR_EMAIL}</strong> • All prompts & videos sync directly to <strong className="text-[#1A1A18]">Supabase Backend</strong>
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link
              to="/browse"
              target="_blank"
              className="flex-1 sm:flex-initial justify-center px-4 py-2 text-xs font-bold bg-white border border-[#E8E9F0] text-[#1A1A18] rounded-xl hover:bg-[#F7F8FC] transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-[#8AAAFF]" />
              <span>Live Site</span>
            </Link>

            <button
              onClick={handleLockSession}
              className="flex-1 sm:flex-initial justify-center px-4 py-2 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 rounded-xl hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              title="Lock Creator Studio Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Lock Studio</span>
            </button>
          </div>
        </div>

        {/* Success Alert */}
        <AnimatePresence>
          {successMessage && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mb-6 sm:mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-bold">{successMessage}</span>
              </div>
              <button
                onClick={() => setSuccessMessage(null)}
                className="text-xs font-bold text-emerald-700 hover:underline cursor-pointer"
              >
                Dismiss
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 mb-6 sm:mb-8 bg-[#F7F8FC] p-1.5 rounded-2xl border border-[#E8E9F0] w-full sm:w-fit overflow-x-auto no-scrollbar -mx-4 px-4 sm:mx-0 sm:px-1.5">
          <button
            onClick={() => setActiveTab('upload')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-[#1A1A18] shadow-sm border border-[#E8E9F0]'
                : 'text-[#6B6D75] hover:text-[#1A1A18]'
            }`}
          >
            {editingPromptId ? <Pencil className="w-3.5 h-3.5 text-amber-500" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{editingPromptId ? 'Edit Prompt' : 'Upload New'}</span>
          </button>

          <button
            onClick={() => setActiveTab('manage')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'manage'
                ? 'bg-white text-[#1A1A18] shadow-sm border border-[#E8E9F0]'
                : 'text-[#6B6D75] hover:text-[#1A1A18]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Manage ({prompts.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('code-export')}
            className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'code-export'
                ? 'bg-white text-[#1A1A18] shadow-sm border border-[#E8E9F0]'
                : 'text-[#6B6D75] hover:text-[#1A1A18]'
            }`}
          >
            <FileCode className="w-3.5 h-3.5" />
            <span>Code Export</span>
          </button>
        </div>

        {/* TAB 1: UPLOAD / EDIT PROMPT */}
        {activeTab === 'upload' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-10">
            {/* Left: Input Form (7 cols) */}
            <div className="lg:col-span-7 bg-white rounded-2xl sm:rounded-3xl border border-[#E8E9F0] p-5 sm:p-8 card-shadow">
              {editingPromptId && (
                <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-2xl flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center flex-shrink-0 font-bold">
                      <Pencil className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <span className="block text-xs font-extrabold text-amber-950 truncate">
                        Editing: {title || 'Prompt'}
                      </span>
                      <span className="text-[11px] text-amber-800/80 block">
                        Make your modifications and click "Save & Update Prompt" below.
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleCancelEdit}
                    className="px-3 py-1.5 bg-white border border-amber-300 text-amber-900 rounded-xl text-xs font-bold hover:bg-amber-100 transition-colors cursor-pointer flex-shrink-0"
                  >
                    Cancel Edit
                  </button>
                </div>
              )}

              <div className="mb-6 pb-6 border-b border-[#F0F1F6]">
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1A1A18] flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-[#8AAAFF]" />
                  {editingPromptId ? 'Edit Prompt Details' : 'Prompt Details & Publishing Form'}
                </h2>
                <p className="text-xs text-[#6B6D75] mt-1">
                  {editingPromptId
                    ? 'Update the fields below to modify your live prompt in Supabase.'
                    : 'Fill in the details below. Once you click publish, the prompt will be instantly live on your website under PROMPT STUDIO.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Creator Attribution & Handle Settings */}
                <div className="p-4 bg-[#F7F8FC] border border-[#E8E9F0] rounded-2xl">
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A18] flex items-center gap-1.5">
                      <BadgeCheck className="w-4 h-4 text-[#8AAAFF]" />
                      Creator Branding & Handle
                    </label>
                    <span className="text-[11px] font-black text-[#8AAAFF] bg-[#8AAAFF]/10 px-2.5 py-0.5 rounded-full">
                      @{creatorHandle.replace(/^@+/, '') || 'promptstudio'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <span className="block text-[11px] font-bold text-[#6B6D75] mb-1">
                        Creator Display Name
                      </span>
                      <input
                        type="text"
                        value={creatorName}
                        onChange={(e) => {
                          setCreatorName(e.target.value);
                          localStorage.setItem('ps_creator_name', e.target.value);
                        }}
                        placeholder="e.g. PROMPT STUDIO"
                        className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#E8E9F0] focus:border-[#1A1A18] text-xs font-bold outline-none transition-colors"
                      />
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-[#6B6D75] mb-1">
                        Creator Handle
                      </span>
                      <div className="relative flex items-center">
                        <span className="absolute left-3.5 text-xs font-bold text-[#8B8E9A]">@</span>
                        <input
                          type="text"
                          value={creatorHandle.replace(/^@+/, '')}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/^@+/, '');
                            setCreatorHandle(clean);
                            localStorage.setItem('ps_creator_handle', clean);
                          }}
                          placeholder="promptstudio"
                          className="w-full pl-8 pr-3.5 py-2.5 rounded-xl bg-white border border-[#E8E9F0] focus:border-[#1A1A18] text-xs font-bold outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B6D75] mt-2">
                    Tip: Any changes here immediately apply to your live card preview and will be saved on your next prompt.
                  </p>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18] mb-2">
                    Prompt Title *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Neo-Brutalist SaaS Platform UI"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-sm font-semibold outline-none transition-colors"
                  />
                </div>

                {/* Category & Model Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18] mb-2">
                      Category *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-sm font-medium outline-none bg-white cursor-pointer"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.name}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18] mb-2">
                      Model / Framework Badge
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. AI APP, 3D WEB, Claude 3.7, Next.js"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-sm font-medium outline-none"
                    />
                  </div>
                </div>

                {/* Type Label & Price */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18] mb-2">
                      Format Label
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Interactive App, Landing Page, System"
                      value={typeLabel}
                      onChange={(e) => setTypeLabel(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-sm font-medium outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18] mb-2">
                      Pricing Option
                    </label>
                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setIsFree(true)}
                        className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          isFree
                            ? 'bg-[#1A1A18] text-white border-[#1A1A18]'
                            : 'bg-white text-[#1A1A18] border-[#E8E9F0] hover:bg-[#F7F8FC]'
                        }`}
                      >
                        Free Template
                      </button>

                      <button
                        type="button"
                        onClick={() => setIsFree(false)}
                        className={`flex-1 py-3 px-3 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
                          !isFree
                            ? 'bg-[#1A1A18] text-white border-[#1A1A18]'
                            : 'bg-white text-[#1A1A18] border-[#E8E9F0] hover:bg-[#F7F8FC]'
                        }`}
                      >
                        Paid ($)
                      </button>
                    </div>

                    {!isFree && (
                      <div className="mt-2 relative">
                        <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-bold text-[#8B8E9A]">
                          $
                        </span>
                        <input
                          type="number"
                          min="1"
                          placeholder="29"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full pl-8 pr-4 py-2 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-sm font-bold outline-none"
                        />
                      </div>
                    )}
                  </div>
                </div>

                {/* Short Description */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18] mb-2">
                    Short Description *
                  </label>
                  <textarea
                    rows={2}
                    required
                    placeholder="Brief 1-2 sentence description for marketplace preview cards..."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-sm font-medium outline-none resize-none"
                  />
                </div>

                {/* Full Prompt Template */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A18]">
                      Prompt Code / Master Instructions *
                    </label>
                    <span className="text-[11px] text-[#8B8E9A]">Buyer copies this after purchase</span>
                  </div>
                  <textarea
                    rows={6}
                    required
                    placeholder="Enter the complete prompt text, instructions, parameters, design guidelines, code context..."
                    value={promptTemplate}
                    onChange={(e) => setPromptTemplate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] font-mono text-xs text-[#1A1A18] outline-none"
                  />
                </div>

                {/* Media Section: Video Preview with Device Upload */}
                <div className="p-5 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0] space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A18]">
                        Preview Video (Interactive Card & Details Page)
                      </label>
                      <p className="text-[11px] text-[#6B6D75]">
                        Upload directly from this device or provide a video URL
                      </p>
                    </div>

                    {/* Mode Toggle */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-xl border border-[#E8E9F0] self-start sm:self-auto">
                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('device')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          videoSourceMode === 'device'
                            ? 'bg-[#1A1A18] text-white shadow-sm'
                            : 'text-[#6B6D75] hover:text-[#1A1A18]'
                        }`}
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload from Device</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setVideoSourceMode('url')}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                          videoSourceMode === 'url'
                            ? 'bg-[#1A1A18] text-white shadow-sm'
                            : 'text-[#6B6D75] hover:text-[#1A1A18]'
                        }`}
                      >
                        <Film className="w-3.5 h-3.5" />
                        <span>Video URL / Path</span>
                      </button>
                    </div>
                  </div>

                  {videoSourceMode === 'device' ? (
                    <div>
                      {previewVideo && uploadedVideoName ? (
                        <div className="p-4 bg-white rounded-xl border border-emerald-200 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3 overflow-hidden">
                            <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                              <Film className="w-5 h-5" />
                            </div>
                            <div className="truncate">
                              <p className="text-xs font-bold text-[#1A1A18] truncate">{uploadedVideoName}</p>
                              <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                                <CheckCircle className="w-3 h-3" /> Video ready from device
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setPreviewVideo('');
                              setUploadedVideoName('');
                            }}
                            className="p-2 text-[#8B8E9A] hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Remove uploaded video"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="border-2 border-dashed border-[#CBD0DF] hover:border-[#1A1A18] bg-white rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors group text-center">
                          <input
                            type="file"
                            accept="video/mp4,video/webm,video/ogg,video/quicktime,video/*"
                            onChange={handleVideoFileUpload}
                            className="hidden"
                          />
                          <div className="w-12 h-12 bg-[#F7F8FC] group-hover:bg-[#1A1A18] text-[#1A1A18] group-hover:text-white rounded-2xl flex items-center justify-center mb-3 transition-colors shadow-sm">
                            <Upload className="w-5 h-5" />
                          </div>
                          <span className="text-xs font-bold text-[#1A1A18] mb-1">
                            Click to select video from this device
                          </span>
                          <span className="text-[11px] text-[#8B8E9A]">
                            Supports MP4, WebM, MOV video previews
                          </span>
                          {videoLoading && (
                            <span className="mt-2 text-xs font-bold text-[#8AAAFF] animate-pulse">
                              Loading video from device...
                            </span>
                          )}
                        </label>
                      )}
                    </div>
                  ) : (
                    <div>
                      <input
                        type="text"
                        placeholder="e.g. https://your-cdn.com/demo.mp4"
                        value={previewVideo}
                        onChange={(e) => {
                          setPreviewVideo(e.target.value);
                          setUploadedVideoName('');
                        }}
                        className="w-full px-4 py-3 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-xs font-mono outline-none bg-white"
                      />
                    </div>
                  )}

                  {/* Fallback / Cover Image Option */}
                  <div className="pt-3 border-t border-[#E8E9F0]">
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#1A1A18]">
                        Cover Image (Fallback / Poster)
                      </label>
                      <button
                        type="button"
                        onClick={() => setImageSourceMode(imageSourceMode === 'device' ? 'url' : 'device')}
                        className="text-[11px] text-[#8B8E9A] hover:text-[#1A1A18] font-bold underline cursor-pointer"
                      >
                        {imageSourceMode === 'device' ? 'Switch to Image URL' : 'Upload Image from Device'}
                      </button>
                    </div>

                    {imageSourceMode === 'device' ? (
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2.5 bg-white border border-[#E8E9F0] hover:border-[#1A1A18] rounded-xl text-xs font-bold text-[#1A1A18] cursor-pointer flex items-center gap-2">
                          <Upload className="w-3.5 h-3.5" />
                          <span>{uploadedImageName || 'Select image from device'}</span>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageFileUpload}
                            className="hidden"
                          />
                        </label>
                        {imageUrl && (
                          <button
                            type="button"
                            onClick={() => {
                              setImageUrl('');
                              setUploadedImageName('');
                            }}
                            className="text-xs text-rose-600 hover:underline font-bold cursor-pointer"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ) : (
                      <input
                        type="text"
                        placeholder="e.g. https://images.unsplash.com/photo-..."
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#E8E9F0] focus:border-[#1A1A18] text-xs font-mono outline-none bg-white"
                      />
                    )}
                  </div>
                </div>

                {/* Key Feature Highlights */}
                <div className="p-4 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0] space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#1A1A18]">
                    Key Features Highlights (Appears on Details Page)
                  </p>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Feature 1 Title"
                      value={feat1Title}
                      onChange={(e) => setFeat1Title(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#E8E9F0] bg-white font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Feature 1 Subtitle"
                      value={feat1Sub}
                      onChange={(e) => setFeat1Sub(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#E8E9F0] bg-white text-[#6B6D75]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Feature 2 Title"
                      value={feat2Title}
                      onChange={(e) => setFeat2Title(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#E8E9F0] bg-white font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Feature 2 Subtitle"
                      value={feat2Sub}
                      onChange={(e) => setFeat2Sub(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#E8E9F0] bg-white text-[#6B6D75]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    <input
                      type="text"
                      placeholder="Feature 3 Title"
                      value={feat3Title}
                      onChange={(e) => setFeat3Title(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#E8E9F0] bg-white font-medium"
                    />
                    <input
                      type="text"
                      placeholder="Feature 3 Subtitle"
                      value={feat3Sub}
                      onChange={(e) => setFeat3Sub(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-[#E8E9F0] bg-white text-[#6B6D75]"
                    />
                  </div>
                </div>

                {/* Popular toggle */}
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isPopularToggle"
                    checked={isPopular}
                    onChange={(e) => setIsPopular(e.target.checked)}
                    className="w-4 h-4 rounded text-[#1A1A18] focus:ring-[#1A1A18] cursor-pointer"
                  />
                  <label htmlFor="isPopularToggle" className="text-xs font-bold text-[#1A1A18] cursor-pointer">
                    Feature in "Popular" marketplace tabs
                  </label>
                </div>

                {/* Author attribution notice */}
                <div className="p-4 bg-indigo-50/60 border border-indigo-100 rounded-2xl flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0" />
                  <p className="text-xs text-indigo-900 leading-relaxed">
                    <strong>Creator Attribution:</strong> This prompt will be published under <strong>PROMPT STUDIO</strong> with verified badge.
                  </p>
                </div>

                {/* Submit / Update Button */}
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    disabled={isPublishing}
                    className="w-full sm:flex-1 py-4 bg-[#1A1A18] hover:bg-[#333333] disabled:bg-[#555555] text-white rounded-2xl font-bold text-sm uppercase tracking-wider transition-all shadow-md active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:cursor-not-allowed"
                  >
                    {isPublishing ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>{editingPromptId ? 'Updating in Supabase...' : 'Saving Prompt & Media to Supabase...'}</span>
                      </>
                    ) : editingPromptId ? (
                      <>
                        <Check className="w-4 h-4 text-emerald-400" />
                        <span>Save & Update Prompt</span>
                      </>
                    ) : (
                      <>
                        <Plus className="w-4 h-4" />
                        <span>Publish Prompt to Website</span>
                      </>
                    )}
                  </button>

                  {editingPromptId && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="w-full sm:w-auto px-6 py-4 bg-white border border-[#E8E9F0] hover:bg-[#F7F8FC] text-[#1A1A18] rounded-2xl font-bold text-sm uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Right: Real-time Live Preview Card (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              <div className="sticky top-28">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#1A1A18] flex items-center gap-1.5">
                    <Eye className="w-3.5 h-3.5 text-[#8AAAFF]" /> Live Card Preview
                  </span>
                  <span className="text-[11px] text-[#8B8E9A]">Exactly how visitors will see it</span>
                </div>

                <div className="bg-[#F7F8FC] p-4 rounded-3xl border border-[#E8E9F0]">
                  <PromptCard prompt={livePreviewPrompt} />
                </div>

                <div className="mt-6 p-4 bg-white rounded-2xl border border-[#E8E9F0] text-xs text-[#6B6D75] space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A18]">Author Stamped:</span>
                    <span className="font-semibold text-emerald-600 flex items-center gap-1">
                      <CheckCircle className="w-3 h-3" /> PROMPT STUDIO
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A18]">Category:</span>
                    <span className="font-semibold text-[#1A1A18]">{category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[#1A1A18]">Price:</span>
                    <span className="font-semibold text-[#1A1A18]">{isFree ? 'Free' : `$${price}`}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE PUBLISHED PROMPTS */}
        {activeTab === 'manage' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E9F0] p-5 sm:p-8 card-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 sm:mb-8 pb-6 border-b border-[#F0F1F6]">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1A1A18]">
                  Published Prompts Catalog ({prompts.length})
                </h2>
                <p className="text-xs text-[#6B6D75] mt-1">
                  Manage, preview, or remove prompts currently live in your marketplace.
                </p>
              </div>

              {prompts.length > 0 && (
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove all prompts?')) {
                      resetPrompts();
                    }
                  }}
                  className="px-4 py-2 bg-rose-50 text-rose-700 border border-rose-200 rounded-xl text-xs font-bold hover:bg-rose-100 transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Clear All Prompts</span>
                </button>
              )}
            </div>

            {prompts.length === 0 ? (
              <div className="text-center py-14 sm:py-20 bg-[#F7F8FC] rounded-2xl border border-[#E8E9F0] px-4">
                <div className="w-12 h-12 bg-white rounded-xl border border-[#E8E9F0] flex items-center justify-center mx-auto mb-4 text-[#8B8E9A]">
                  <Sparkles className="w-6 h-6 text-[#8AAAFF]" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-[#1A1A18] mb-1">
                  No Prompts Published Yet
                </h3>
                <p className="text-xs text-[#6B6D75] max-w-sm mx-auto mb-6">
                  You have cleared all dummy data. Click the button below to upload your first official prompt!
                </p>
                <button
                  onClick={() => setActiveTab('upload')}
                  className="px-6 py-3 bg-[#1A1A18] text-white rounded-xl font-bold text-xs uppercase tracking-wider hover:bg-[#333333] transition-colors cursor-pointer"
                >
                  + Upload Your First Prompt
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto -mx-5 px-5 sm:mx-0 sm:px-0">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead>
                    <tr className="border-b border-[#E8E9F0] text-[#8B8E9A] uppercase tracking-wider font-bold">
                      <th className="py-3 px-4">Title & Description</th>
                      <th className="py-3 px-4">Category</th>
                      <th className="py-3 px-4">Model</th>
                      <th className="py-3 px-4">Price</th>
                      <th className="py-3 px-4">Author</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F0F1F6]">
                    {prompts.map((p) => (
                      <tr key={p.id} className="hover:bg-[#F7F8FC] transition-colors">
                        <td className="py-4 px-4 max-w-xs">
                          <p className="font-bold text-[#1A1A18] truncate">{p.title}</p>
                          <p className="text-[11px] text-[#6B6D75] truncate mt-0.5">{p.description}</p>
                        </td>
                        <td className="py-4 px-4">
                          <span className="px-2.5 py-1 bg-[#F0F1F6] text-[#1A1A18] rounded-full font-bold">
                            {p.category}
                          </span>
                        </td>
                        <td className="py-4 px-4 font-mono text-[#1A1A18] font-bold">
                          {p.model}
                        </td>
                        <td className="py-4 px-4 font-bold text-[#1A1A18]">
                          {p.price === 'Free' ? (
                            <span className="text-emerald-600 font-bold">Free</span>
                          ) : (
                            `$${p.price}`
                          )}
                        </td>
                        <td className="py-4 px-4">
                          <span className="font-bold text-[#1A1A18] flex items-center gap-1 text-xs">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#8AAAFF]" />
                            {p.creator.name}
                          </span>
                          <span className="text-[10px] text-[#6B6D75] font-semibold block">
                            @{p.creator.handle.replace(/^@+/, '')}
                          </span>
                        </td>
                        <td className="py-4 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleStartEdit(p)}
                              className="px-2.5 py-1.5 bg-white border border-[#E8E9F0] hover:border-[#1A1A18] text-[#1A1A18] rounded-lg transition-colors cursor-pointer flex items-center gap-1 font-bold text-xs"
                              title="Edit Prompt"
                            >
                              <Pencil className="w-3.5 h-3.5 text-[#8AAAFF]" />
                              <span>Edit</span>
                            </button>
                            <Link
                              to={`/prompt/${p.id}`}
                              target="_blank"
                              className="p-2 bg-white border border-[#E8E9F0] hover:border-[#8AAAFF] text-[#1A1A18] rounded-lg transition-colors"
                              title="View Prompt Page"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Link>
                            <button
                              onClick={() => {
                                if (confirm(`Delete prompt "${p.title}"?`)) {
                                  deletePrompt(p.id);
                                }
                              }}
                              className="p-2 bg-rose-50 border border-rose-200 text-rose-600 hover:bg-rose-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete Prompt"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CODE EXPORT */}
        {activeTab === 'code-export' && (
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#E8E9F0] p-5 sm:p-8 card-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
              <div>
                <h2 className="font-display text-lg sm:text-xl font-extrabold text-[#1A1A18]">
                  Permanent Code Export (Git / File Sync)
                </h2>
                <p className="text-xs text-[#6B6D75] mt-1">
                  If you want your uploaded prompts to be permanently embedded directly into your source code repository, copy this code into <code className="bg-[#F0F1F6] px-1.5 py-0.5 rounded text-[#1A1A18]">src/data/prompts.ts</code>.
                </p>
              </div>

              <button
                onClick={() => {
                  navigator.clipboard.writeText(generateExportCode());
                  setCopiedCode(true);
                  setTimeout(() => setCopiedCode(false), 2000);
                }}
                className="w-full sm:w-auto justify-center px-4 py-2.5 bg-[#1A1A18] hover:bg-[#333333] text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
              >
                {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedCode ? 'Copied Code!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 bg-[#1A1A18] text-[#F7F8FC] rounded-2xl text-xs font-mono overflow-x-auto max-h-[500px]">
              <code>{generateExportCode()}</code>
            </pre>
          </div>
        )}

      </div>
    </div>
  );
};
