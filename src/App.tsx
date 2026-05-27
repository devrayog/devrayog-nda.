import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './contexts/AuthContext'
import Layout from './components/layout/Layout'
import AdminLayout from './components/layout/AdminLayout'
import Landing from './pages/Landing'
import Waitlist from './pages/Waitlist'
import GetInside from './pages/GetInside'
import Login from './pages/Login'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import AITutor from './pages/AITutor'
import StudyPlan from './pages/StudyPlan'
import MathsHub from './pages/MathsHub'
import GATHub from './pages/GATHub'
import EnglishHub from './pages/EnglishHub'
import TopicDetail from './pages/TopicDetail'
import CurrentAffairs from './pages/CurrentAffairs'
import CurrentAffairsDetail from './pages/CurrentAffairsDetail'
import PYQ from './pages/PYQ'
import Notes from './pages/Notes'
import Bookmarks from './pages/Bookmarks'
import Revision from './pages/Revision'
import Formulas from './pages/Formulas'
import Vocabulary from './pages/Vocabulary'
import Tests from './pages/Tests'
import TestEngine from './pages/TestEngine'
import TestResults from './pages/TestResults'
import QuestionBank from './pages/QuestionBank'
import ErrorLog from './pages/ErrorLog'
import DailyChallenge from './pages/DailyChallenge'
import SSBOverview from './pages/ssb/SSBOverview'
import OIR from './pages/ssb/OIR'
import PPDT from './pages/ssb/PPDT'
import TAT from './pages/ssb/TAT'
import WAT from './pages/ssb/WAT'
import SRT from './pages/ssb/SRT'
import SDT from './pages/ssb/SDT'
import GD from './pages/ssb/GD'
import Interview from './pages/ssb/Interview'
import PersonalityTips from './pages/ssb/PersonalityTips'
import ScreenOut from './pages/ssb/ScreenOut'
import Community from './pages/community/Community'
import Chat from './pages/community/Chat'
import Mentors from './pages/community/Mentors'
import StudyPartners from './pages/community/StudyPartners'
import SuccessStories from './pages/community/SuccessStories'
import Fitness from './pages/fitness/Fitness'
import RunningTracker from './pages/fitness/RunningTracker'
import FitnessEligibility from './pages/fitness/FitnessEligibility'
import MedicalStandards from './pages/fitness/MedicalStandards'
import MedicalCheck from './pages/fitness/MedicalCheck'
import Resources from './pages/resources/Resources'
import Books from './pages/resources/Books'
import Videos from './pages/resources/Videos'
import Downloads from './pages/resources/Downloads'
import FAQ from './pages/resources/FAQ'
import GirlsNDA from './pages/GirlsNDA'
import Premium from './pages/Premium'
import Profile from './pages/Profile'
import Settings from './pages/Settings'
import Achievements from './pages/Achievements'
import Leaderboard from './pages/Leaderboard'
import ActivityLog from './pages/ActivityLog'
import DNAScore from './pages/DNAScore'
import Notifications from './pages/Notifications'
import PlatformGuide from './pages/PlatformGuide'
import InstallApp from './pages/InstallApp'
import Blogs from './pages/Blogs'
import BlogDetail from './pages/BlogDetail'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminWaitlist from './pages/admin/AdminWaitlist'
import AdminUsers from './pages/admin/AdminUsers'
import AdminTopics from './pages/admin/AdminTopics'
import AdminCurrentAffairs from './pages/admin/AdminCurrentAffairs'
import AdminPYQ from './pages/admin/AdminPYQ'
import AdminResources from './pages/admin/AdminResources'
import AdminFAQ from './pages/admin/AdminFAQ'
import AdminSSB from './pages/admin/AdminSSB'
import AdminSuccessStories from './pages/admin/AdminSuccessStories'
import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSEO from './pages/admin/AdminSEO'
import AdminMockTests from './pages/admin/AdminMockTests'
import AdminGuide from './pages/admin/AdminGuide'
import AdminReports from './pages/admin/AdminReports'
import AdminGirlsNDA from './pages/admin/AdminGirlsNDA'
import AdminSettings from './pages/admin/AdminSettings'
import AdminPremium from './pages/admin/AdminPremium'
import AdminFitness from './pages/admin/AdminFitness'
import AdminMedical from './pages/admin/AdminMedical'
import AdminPersonality from './pages/admin/AdminPersonality'
import AdminScreenout from './pages/admin/AdminScreenout'
import AdminVocabulary from './pages/admin/AdminVocabulary'
import AdminDailyTasks from './pages/admin/AdminDailyTasks'
import AdminOIR from './pages/admin/AdminOIR'
import AdminAI from './pages/admin/AdminAI'
import AdminBlogs from './pages/admin/AdminBlogs'
import AdminFormulas from './pages/admin/AdminFormulas'
import AdminMentors from './pages/admin/AdminMentors'
import AdminPageToggles from './pages/admin/AdminPageToggles'
import AdminCountdown from './pages/admin/AdminCountdown'
import AdminDiagnostic from './pages/admin/AdminDiagnostic'
import AdminBroadcast from './pages/admin/AdminBroadcast'
import AdminFeedback from './pages/admin/AdminFeedback'

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-[#0B1628] flex items-center justify-center"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>
  if (!user) return <Navigate to="/login" replace />
  return <>{children}</>
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, profile, loading } = useAuth()
  if (loading) return <div className="min-h-screen bg-gray-950 flex items-center justify-center"><div className="w-8 h-8 border-2 border-yellow-500 border-t-transparent rounded-full animate-spin"/></div>
  if (!user || !profile?.is_admin) return <Navigate to="/dashboard" replace />
  return <>{children}</>
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing/>}/>
      <Route path="/signup" element={<Waitlist/>}/>
      <Route path="/waitlist" element={<Waitlist/>}/>
      <Route path="/get-inside" element={<GetInside/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/forgot-password" element={<ForgotPassword/>}/>
      <Route path="/blogs" element={<Blogs/>}/>
      <Route path="/blogs/:slug" element={<BlogDetail/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/guide" element={<PlatformGuide/>}/>
      <Route path="/" element={<PrivateRoute><Layout/></PrivateRoute>}>
        <Route path="dashboard" element={<Dashboard/>}/>
        <Route path="ai-tutor" element={<AITutor/>}/>
        <Route path="study-plan" element={<StudyPlan/>}/>
        <Route path="study/maths" element={<MathsHub/>}/>
        <Route path="study/gat" element={<GATHub/>}/>
        <Route path="study/english" element={<EnglishHub/>}/>
        <Route path="study/topic/:topicId" element={<TopicDetail/>}/>
        <Route path="current-affairs" element={<CurrentAffairs/>}/>
        <Route path="current-affairs/:slug" element={<CurrentAffairsDetail/>}/>
        <Route path="pyq" element={<PYQ/>}/>
        <Route path="notes" element={<Notes/>}/>
        <Route path="bookmarks" element={<Bookmarks/>}/>
        <Route path="revision" element={<Revision/>}/>
        <Route path="formulas" element={<Formulas/>}/>
        <Route path="vocabulary" element={<Vocabulary/>}/>
        <Route path="tests" element={<Tests/>}/>
        <Route path="tests/take/:testId" element={<TestEngine/>}/>
        <Route path="tests/results/:resultId" element={<TestResults/>}/>
        <Route path="question-bank" element={<QuestionBank/>}/>
        <Route path="error-log" element={<ErrorLog/>}/>
        <Route path="daily-challenge" element={<DailyChallenge/>}/>
        <Route path="ssb" element={<SSBOverview/>}/>
        <Route path="ssb/oir" element={<OIR/>}/>
        <Route path="ssb/ppdt" element={<PPDT/>}/>
        <Route path="ssb/tat" element={<TAT/>}/>
        <Route path="ssb/wat" element={<WAT/>}/>
        <Route path="ssb/srt" element={<SRT/>}/>
        <Route path="ssb/sdt" element={<SDT/>}/>
        <Route path="ssb/gd" element={<GD/>}/>
        <Route path="ssb/interview" element={<Interview/>}/>
        <Route path="ssb/personality" element={<PersonalityTips/>}/>
        <Route path="ssb/screenout" element={<ScreenOut/>}/>
        <Route path="community" element={<Community/>}/>
        <Route path="community/chat" element={<Chat/>}/>
        <Route path="mentors" element={<Mentors/>}/>
        <Route path="study-partners" element={<StudyPartners/>}/>
        <Route path="success-stories" element={<SuccessStories/>}/>
        <Route path="fitness" element={<Fitness/>}/>
        <Route path="fitness/running" element={<RunningTracker/>}/>
        <Route path="fitness/eligibility" element={<FitnessEligibility/>}/>
        <Route path="fitness/medical" element={<MedicalStandards/>}/>
        <Route path="fitness/medical-check" element={<MedicalCheck/>}/>
        <Route path="resources" element={<Resources/>}/>
        <Route path="resources/books" element={<Books/>}/>
        <Route path="resources/videos" element={<Videos/>}/>
        <Route path="resources/downloads" element={<Downloads/>}/>
        <Route path="faq" element={<FAQ/>}/>
        <Route path="girls" element={<GirlsNDA/>}/>
        <Route path="premium" element={<Premium/>}/>
        <Route path="profile" element={<Profile/>}/>
        <Route path="settings" element={<Settings/>}/>
        <Route path="achievements" element={<Achievements/>}/>
        <Route path="leaderboard" element={<Leaderboard/>}/>
        <Route path="activity" element={<ActivityLog/>}/>
        <Route path="dna-score" element={<DNAScore/>}/>
        <Route path="notifications" element={<Notifications/>}/>
        <Route path="install" element={<InstallApp/>}/>
      </Route>
      <Route path="/admin" element={<AdminRoute><AdminLayout/></AdminRoute>}>
        <Route index element={<AdminDashboard/>}/>
        <Route path="waitlist" element={<AdminWaitlist/>}/>
        <Route path="users" element={<AdminUsers/>}/>
        <Route path="topics" element={<AdminTopics/>}/>
        <Route path="current-affairs" element={<AdminCurrentAffairs/>}/>
        <Route path="pyq" element={<AdminPYQ/>}/>
        <Route path="resources" element={<AdminResources/>}/>
        <Route path="faq" element={<AdminFAQ/>}/>
        <Route path="ssb" element={<AdminSSB/>}/>
        <Route path="success-stories" element={<AdminSuccessStories/>}/>
        <Route path="announcements" element={<AdminAnnouncements/>}/>
        <Route path="seo" element={<AdminSEO/>}/>
        <Route path="mock-tests" element={<AdminMockTests/>}/>
        <Route path="guide" element={<AdminGuide/>}/>
        <Route path="reports" element={<AdminReports/>}/>
        <Route path="girls-nda" element={<AdminGirlsNDA/>}/>
        <Route path="settings" element={<AdminSettings/>}/>
        <Route path="premium-settings" element={<AdminPremium/>}/>
        <Route path="fitness" element={<AdminFitness/>}/>
        <Route path="medical" element={<AdminMedical/>}/>
        <Route path="personality" element={<AdminPersonality/>}/>
        <Route path="screenout" element={<AdminScreenout/>}/>
        <Route path="vocabulary" element={<AdminVocabulary/>}/>
        <Route path="daily-tasks" element={<AdminDailyTasks/>}/>
        <Route path="oir" element={<AdminOIR/>}/>
        <Route path="ai" element={<AdminAI/>}/>
        <Route path="blogs" element={<AdminBlogs/>}/>
        <Route path="formulas" element={<AdminFormulas/>}/>
        <Route path="mentors" element={<AdminMentors/>}/>
        <Route path="page-toggles" element={<AdminPageToggles/>}/>
        <Route path="countdown" element={<AdminCountdown/>}/>
        <Route path="diagnostic" element={<AdminDiagnostic/>}/>
        <Route path="broadcast" element={<AdminBroadcast/>}/>
        <Route path="feedback" element={<AdminFeedback/>}/>
      </Route>
      <Route path="*" element={<NotFound/>}/>
    </Routes>
  )
}
