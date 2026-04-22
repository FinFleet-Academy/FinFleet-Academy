import React, { useState, useEffect } from 'react';
import { useAuth, PLANS } from '../context/AuthContext';
import { 
  Users, Ticket, Trash2, ArrowUpCircle, XCircle, Search, ShieldAlert, 
  BellRing, Send, Newspaper, BookOpen, PlusCircle, LayoutDashboard,
  ExternalLink, Video, CheckCircle, MessageSquare, Mail, Clock
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const { 
    isAdmin, 
    upgradePlan, 
    addCoupon, 
    deleteCoupon,
    fetchUsers,
    fetchSubscribers,
    fetchCoupons,
    adminSendNotification,
    createNews,
    deleteNews,
    createCourse,
    deleteCourse,
    fetchContacts,
    deleteAdminContact
  } = useAuth();
  
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [usersList, setUsersList] = useState([]);
  const [subscribersList, setSubscribersList] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [newsList, setNewsList] = useState([]);
  const [coursesList, setCoursesList] = useState([]);
  const [contactsList, setContactsList] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Forms state
  const [couponForm, setCouponForm] = useState({ code: '', discountPercent: '' });
  const [searchTerm, setSearchTerm] = useState('');
  const [notifForm, setNotifForm] = useState({ email: 'ALL', message: '' });
  
  const [newsForm, setNewsForm] = useState({
    title: '', summary: '', content: '', category: 'Stock Market', sourceLink: '', isTrending: false
  });
  
  const [courseForm, setCourseForm] = useState({
    title: '', description: '', content: '', videoUrl: '', icon: 'BookOpen', category: 'Trading', isPremium: true
  });

  const loadData = async () => {
    try {
      const [users, allCoupons, subscribers, allNews, allCourses, allContacts] = await Promise.all([
        fetchUsers(),
        fetchCoupons(),
        fetchSubscribers(),
        axios.get('/api/news'),
        axios.get('/api/courses'),
        fetchContacts()
      ]);
      setUsersList(users);
      setCoupons(allCoupons);
      setSubscribersList(subscribers);
      setNewsList(allNews.data);
      setCoursesList(allCourses.data);
      setContactsList(allContacts);
    } catch (error) {
      console.error("Admin Load Error:", error);
      toast.error("Failed to fetch admin data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      loadData();
    }
  }, [isAdmin]);

  if (!isAdmin) {
    return (
      <div className="py-24 text-center min-h-[calc(100vh-80px)] flex flex-col items-center justify-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
        <h2 className="text-3xl font-bold dark:text-white mb-2">Access Denied</h2>
        <p className="text-slate-500">You must be logged in as an administrator to view this page.</p>
        <button onClick={() => navigate('/')} className="mt-6 btn-primary">Return Home</button>
      </div>
    );
  }

  // Action Handlers
  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await addCoupon(couponForm.code, couponForm.discountPercent);
      toast.success(`Coupon created!`);
      setCouponForm({ code: '', discountPercent: '' });
      loadData();
    } catch (error) {
      toast.error("Failed to create coupon");
    }
  };

  const handleCreateNews = async (e) => {
    e.preventDefault();
    try {
      await createNews(newsForm);
      toast.success("News article published!");
      setNewsForm({ title: '', summary: '', content: '', category: 'Stock Market', sourceLink: '', isTrending: false });
      loadData();
    } catch (error) {
      toast.error("Failed to publish news");
    }
  };

  const handleDeleteNews = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteNews(id);
      toast.success("News deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete news");
    }
  };

  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      await createCourse(courseForm);
      toast.success("Course added successfully!");
      setCourseForm({ title: '', description: '', content: '', videoUrl: '', icon: 'BookOpen', category: 'Trading', isPremium: true });
      loadData();
    } catch (error) {
      toast.error("Failed to add course");
    }
  };

  const handleDeleteCourse = async (id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      await deleteCourse(id);
      toast.success("Course deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete course");
    }
  };

  const handleDeleteContact = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await deleteAdminContact(id);
      toast.success("Message deleted");
      loadData();
    } catch (error) {
      toast.error("Failed to delete message");
    }
  };

  const filteredUsers = usersList.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-slate-50 dark:bg-slate-950">
      
      {/* Sidebar Navigation */}
      <div className="w-full lg:w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6">
        <div className="flex items-center space-x-3 mb-10 px-2">
          <ShieldAlert className="w-8 h-8 text-brand-600" />
          <span className="text-xl font-bold dark:text-white">Admin Panel</span>
        </div>
        
        <nav className="space-y-2">
          {[
            { id: 'overview', name: 'Overview', icon: LayoutDashboard },
            { id: 'news', name: 'News Feed', icon: Newspaper },
            { id: 'courses', name: 'Courses', icon: BookOpen },
            { id: 'messages', name: 'Messages', icon: MessageSquare }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === tab.id 
                ? 'bg-brand-600 text-white shadow-lg shadow-brand-600/20' 
                : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-6 lg:p-10 overflow-y-auto">
        
        {/* Tab 1: Overview */}
        {activeTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-500">
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Users', value: usersList.length, icon: Users, color: 'text-blue-600', bg: 'bg-blue-100' },
                  { label: 'Subscribers', value: subscribersList.length, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-100' },
                  { label: 'Messages', value: contactsList.length, icon: Mail, color: 'text-red-600', bg: 'bg-red-100' },
                  { label: 'Courses', value: coursesList.length, icon: BookOpen, color: 'text-orange-600', bg: 'bg-orange-100' }
                ].map((stat, i) => (
                  <div key={i} className="card-premium p-4 flex items-center space-x-4 cursor-pointer" onClick={() => stat.label === 'Messages' && setActiveTab('messages')}>
                    <div className={`p-3 ${stat.bg} rounded-xl`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <div className="text-2xl font-bold dark:text-white">{stat.value}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase">{stat.label}</div>
                    </div>
                  </div>
                ))}
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Users List */}
                <div className="card-premium p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold dark:text-white">User Subscriptions</h3>
                    <input 
                      type="text" 
                      placeholder="Search..." 
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-3 py-1.5 text-sm"
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="max-h-[400px] overflow-y-auto space-y-3 pr-2">
                    {filteredUsers.map(u => (
                      <div key={u._id} className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-slate-100 dark:border-slate-800/50">
                        <div>
                          <div className="font-bold text-sm dark:text-white">{u.name}</div>
                          <div className="text-xs text-slate-500">{u.email}</div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="text-[10px] font-bold px-2 py-1 bg-brand-100 dark:bg-brand-900/30 text-brand-600 rounded-full">{u.plan}</span>
                          <button onClick={() => upgradePlan(u._id, PLANS.PRO)} className="text-slate-400 hover:text-brand-600"><ArrowUpCircle className="w-4 h-4" /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Notifications & Coupons */}
                <div className="space-y-6">
                  <div className="card-premium p-6">
                    <h3 className="text-lg font-bold dark:text-white mb-4">Quick Coupon</h3>
                    <form onSubmit={handleCreateCoupon} className="space-y-3">
                      <input 
                        placeholder="Coupon Code" 
                        value={couponForm.code} 
                        onChange={e => setCouponForm({...couponForm, code: e.target.value.toUpperCase()})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm"
                      />
                      <input 
                        type="number" 
                        placeholder="Discount %" 
                        value={couponForm.discountPercent} 
                        onChange={e => setCouponForm({...couponForm, discountPercent: e.target.value})}
                        className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-lg px-4 py-2 text-sm"
                      />
                      <button type="submit" className="w-full btn-primary text-xs py-2">Create Coupon</button>
                    </form>
                  </div>

                  <div className="card-premium p-6">
                    <h3 className="text-lg font-bold dark:text-white mb-4">Latest Message</h3>
                    {contactsList.length > 0 ? (
                      <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-xl border border-brand-500/20">
                        <div className="font-bold text-sm dark:text-white mb-1">{contactsList[0].subject}</div>
                        <p className="text-xs text-slate-500 line-clamp-2">{contactsList[0].message}</p>
                        <button onClick={() => setActiveTab('messages')} className="mt-3 text-[10px] font-bold text-brand-600 uppercase">View All Messages</button>
                      </div>
                    ) : (
                      <p className="text-sm text-slate-500 italic">No messages yet.</p>
                    )}
                  </div>
                </div>
             </div>
          </div>
        )}

        {/* Tab 2: News Management */}
        {activeTab === 'news' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right duration-500">
            <div className="lg:col-span-1">
              <div className="card-premium p-6 sticky top-10">
                <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center">
                  <PlusCircle className="w-5 h-5 mr-2 text-brand-600" />
                  Add News Article
                </h3>
                <form onSubmit={handleCreateNews} className="space-y-4">
                  <input 
                    placeholder="Headline" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-brand-500"
                    value={newsForm.title}
                    onChange={e => setNewsForm({...newsForm, title: e.target.value})}
                  />
                  <select 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm"
                    value={newsForm.category}
                    onChange={e => setNewsForm({...newsForm, category: e.target.value})}
                  >
                    <option>Stock Market</option>
                    <option>Crypto</option>
                    <option>Economy</option>
                    <option>Global News</option>
                    <option>Opinion</option>
                  </select>
                  <textarea 
                    placeholder="Short Summary" 
                    rows="3" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm resize-none"
                    value={newsForm.summary}
                    onChange={e => setNewsForm({...newsForm, summary: e.target.value})}
                  />
                  <textarea 
                    placeholder="Full Content (Markdown supported)" 
                    rows="6" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm resize-none"
                    value={newsForm.content}
                    onChange={e => setNewsForm({...newsForm, content: e.target.value})}
                  />
                  <input 
                    placeholder="Source Link (Optional)" 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm"
                    value={newsForm.sourceLink}
                    onChange={e => setNewsForm({...newsForm, sourceLink: e.target.value})}
                  />
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={newsForm.isTrending}
                      onChange={e => setNewsForm({...newsForm, isTrending: e.target.checked})}
                      className="rounded text-brand-600" 
                    />
                    <span className="text-sm font-bold text-slate-500">Mark as Trending</span>
                  </label>
                  <button type="submit" className="w-full btn-primary py-3">Publish Article</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold dark:text-white mb-6">Published Articles</h3>
              {newsList.map(news => (
                <div key={news._id} className="card-premium p-6 flex flex-col md:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded uppercase tracking-wider">{news.category}</span>
                      {news.isTrending && <span className="px-2 py-0.5 bg-brand-100 text-brand-600 text-[10px] font-bold rounded uppercase">Trending</span>}
                    </div>
                    <h4 className="font-bold dark:text-white text-lg mb-1">{news.title}</h4>
                    <p className="text-xs text-slate-500 line-clamp-1">{news.summary}</p>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0">
                    <a href={`/finor/${news.slug}`} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-brand-600"><ExternalLink className="w-5 h-5" /></a>
                    <button onClick={() => handleDeleteNews(news._id)} className="p-2 text-slate-400 hover:text-red-500"><Trash2 className="w-5 h-5" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Course Management */}
        {activeTab === 'courses' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-right duration-500">
            <div className="lg:col-span-1">
              <div className="card-premium p-6 sticky top-10">
                <h3 className="text-xl font-bold dark:text-white mb-6 flex items-center">
                  <BookOpen className="w-5 h-5 mr-2 text-brand-600" />
                  Create New Course
                </h3>
                <form onSubmit={handleCreateCourse} className="space-y-4">
                  <input 
                    placeholder="Course Title" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm"
                    value={courseForm.title}
                    onChange={e => setCourseForm({...courseForm, title: e.target.value})}
                  />
                  <input 
                    placeholder="Short Description" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm"
                    value={courseForm.description}
                    onChange={e => setCourseForm({...courseForm, description: e.target.value})}
                  />
                  <input 
                    placeholder="Video Link (YouTube/Vimeo)" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm"
                    value={courseForm.videoUrl}
                    onChange={e => setCourseForm({...courseForm, videoUrl: e.target.value})}
                  />
                  <textarea 
                    placeholder="Detailed Content / Resources" 
                    rows="6" 
                    required 
                    className="w-full bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-3 text-sm resize-none"
                    value={courseForm.content}
                    onChange={e => setCourseForm({...courseForm, content: e.target.value})}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      placeholder="Icon Name" 
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm"
                      value={courseForm.icon}
                      onChange={e => setCourseForm({...courseForm, icon: e.target.value})}
                    />
                    <input 
                      placeholder="Category" 
                      className="bg-slate-50 dark:bg-slate-800 border-none rounded-xl px-4 py-2 text-sm"
                      value={courseForm.category}
                      onChange={e => setCourseForm({...courseForm, category: e.target.value})}
                    />
                  </div>
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={courseForm.isPremium}
                      onChange={e => setCourseForm({...courseForm, isPremium: e.target.checked})}
                      className="rounded text-brand-600" 
                    />
                    <span className="text-sm font-bold text-slate-500">Premium Course</span>
                  </label>
                  <button type="submit" className="w-full btn-primary py-3">Add Course</button>
                </form>
              </div>
            </div>

            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-bold dark:text-white mb-6">Existing Courses</h3>
              {coursesList.map(course => (
                <div key={course._id} className="card-premium p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center space-x-4">
                    <div className="p-3 bg-brand-100 dark:bg-brand-900/30 rounded-xl">
                      <Video className="w-6 h-6 text-brand-600" />
                    </div>
                    <div>
                      <h4 className="font-bold dark:text-white text-lg">{course.title}</h4>
                      <div className="flex items-center space-x-2 text-xs text-slate-500">
                        <span>{course.category}</span>
                        {course.isPremium && <span className="text-amber-600 font-bold">★ Premium</span>}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button onClick={() => handleDeleteCourse(course._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 4: Messages */}
        {activeTab === 'messages' && (
          <div className="animate-in slide-in-from-right duration-500 space-y-6">
             <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold dark:text-white">Contact Messages</h3>
                <div className="text-sm text-slate-500 font-bold">{contactsList.length} total entries</div>
             </div>
             
             <div className="grid grid-cols-1 gap-4">
                {contactsList.map((contact) => (
                  <div key={contact._id} className="card-premium p-6 border-l-4 border-brand-500">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
                      <div>
                        <div className="flex items-center space-x-3 mb-1">
                           <h4 className="font-bold text-lg dark:text-white">{contact.name}</h4>
                           <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 rounded uppercase">{contact.subject}</span>
                        </div>
                        <div className="flex items-center text-sm text-slate-500">
                          <Mail className="w-4 h-4 mr-2" />
                          {contact.email}
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center text-xs text-slate-400">
                          <Clock className="w-4 h-4 mr-1.5" />
                          {new Date(contact.createdAt).toLocaleString()}
                        </div>
                        <button onClick={() => handleDeleteContact(contact._id)} className="p-2 text-slate-400 hover:text-red-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/50 p-4 rounded-xl border border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
                      {contact.message}
                    </div>
                  </div>
                ))}
                {contactsList.length === 0 && (
                  <div className="text-center py-20 bg-slate-100 dark:bg-slate-900/50 rounded-3xl text-slate-500">
                    No contact messages found.
                  </div>
                )}
             </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
