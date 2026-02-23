import { useState, useEffect } from 'react';
import { FaInbox, FaPaperPlane, FaEdit, FaTrash, FaEnvelope, FaEnvelopeOpen, FaUser, FaClock, FaTimes, FaSearch } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import { toast } from 'react-toastify';

const Messages = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('inbox');
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showCompose, setShowCompose] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [composeForm, setComposeForm] = useState({
    recipient: '',
    subject: '',
    content: ''
  });

  useEffect(() => {
    fetchMessages();
    fetchUsers();
  }, [activeTab]);

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const endpoint = activeTab === 'inbox' ? '/messages/inbox' : '/messages/sent';
      const response = await api.get(endpoint);
      setMessages(response.data.data || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users?limit=100');
      setUsers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    try {
      await api.post('/messages', composeForm);
      toast.success('Message sent successfully');
      setShowCompose(false);
      setComposeForm({ recipient: '', subject: '', content: '' });
      if (activeTab === 'sent') {
        fetchMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to send message');
    }
  };

  const handleMarkAsRead = async (messageId) => {
    try {
      await api.put(`/messages/${messageId}/read`);
      fetchMessages();
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!window.confirm('Are you sure you want to delete this message?')) return;
    
    try {
      await api.delete(`/messages/${messageId}`);
      toast.success('Message deleted');
      setSelectedMessage(null);
      fetchMessages();
    } catch (error) {
      console.error('Error deleting message:', error);
      toast.error('Failed to delete message');
    }
  };

  const selectMessage = (message) => {
    setSelectedMessage(message);
    if (activeTab === 'inbox' && !message.isRead) {
      handleMarkAsRead(message._id);
    }
  };

  const filteredUsers = users.filter(u => 
    u._id !== user?.id && 
    (u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
     u.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
          <button
            onClick={() => setShowCompose(true)}
            className="flex items-center space-x-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition"
          >
            <FaEdit />
            <span>Compose</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 border-b">
                <h2 className="font-semibold text-gray-900">Folders</h2>
              </div>
              <div className="p-2">
                <button
                  onClick={() => { setActiveTab('inbox'); setSelectedMessage(null); }}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg transition ${
                    activeTab === 'inbox' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <FaInbox />
                    <span>Inbox</span>
                  </div>
                  {unreadCount > 0 && activeTab === 'inbox' && (
                    <span className="bg-primary-600 text-white text-xs px-2 py-1 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
                <button
                  onClick={() => { setActiveTab('sent'); setSelectedMessage(null); }}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition ${
                    activeTab === 'sent' ? 'bg-primary-50 text-primary-600' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <FaPaperPlane />
                  <span>Sent</span>
                </button>
              </div>
            </div>
          </div>

          {/* Message List */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              {loading ? (
                <div className="p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading messages...</p>
                </div>
              ) : selectedMessage ? (
                /* Message Detail */
                <div>
                  <div className="p-4 border-b flex items-center justify-between">
                    <button
                      onClick={() => setSelectedMessage(null)}
                      className="text-gray-600 hover:text-gray-900"
                    >
                      ← Back
                    </button>
                    <button
                      onClick={() => handleDeleteMessage(selectedMessage._id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <FaTrash />
                    </button>
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      {selectedMessage.subject || 'No Subject'}
                    </h2>
                    <div className="flex items-center space-x-4 mb-6 pb-6 border-b">
                      <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                        <FaUser className="text-gray-400" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900">
                          {activeTab === 'inbox' 
                            ? selectedMessage.sender?.name 
                            : selectedMessage.recipient?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          {activeTab === 'inbox' 
                            ? selectedMessage.sender?.email 
                            : selectedMessage.recipient?.email}
                        </p>
                      </div>
                      <div className="text-sm text-gray-500">
                        {new Date(selectedMessage.createdAt).toLocaleString()}
                      </div>
                    </div>
                    <div className="prose max-w-none">
                      <p className="text-gray-700 whitespace-pre-wrap">{selectedMessage.content}</p>
                    </div>
                  </div>
                </div>
              ) : (
                /* Message List */
                <div>
                  <div className="p-4 border-b">
                    <h2 className="font-semibold text-gray-900">
                      {activeTab === 'inbox' ? 'Inbox' : 'Sent Messages'}
                    </h2>
                  </div>
                  <div className="divide-y">
                    {messages.length === 0 ? (
                      <div className="p-12 text-center">
                        <FaEnvelope className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500">No messages</p>
                      </div>
                    ) : (
                      messages.map((message) => (
                        <button
                          key={message._id}
                          onClick={() => selectMessage(message)}
                          className={`w-full text-left p-4 hover:bg-gray-50 transition ${
                            !message.isRead && activeTab === 'inbox' ? 'bg-blue-50' : ''
                          }`}
                        >
                          <div className="flex items-start space-x-4">
                            <div className="flex-shrink-0">
                              {!message.isRead && activeTab === 'inbox' ? (
                                <FaEnvelope className="w-5 h-5 text-primary-600" />
                              ) : (
                                <FaEnvelopeOpen className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between mb-1">
                                <p className={`text-sm font-medium truncate ${
                                  !message.isRead && activeTab === 'inbox' ? 'text-gray-900' : 'text-gray-700'
                                }`}>
                                  {activeTab === 'inbox' 
                                    ? message.sender?.name 
                                    : message.recipient?.name}
                                </p>
                                <div className="flex items-center text-xs text-gray-500 ml-2">
                                  <FaClock className="w-3 h-3 mr-1" />
                                  {new Date(message.createdAt).toLocaleDateString()}
                                </div>
                              </div>
                              <p className={`text-sm mb-1 ${
                                !message.isRead && activeTab === 'inbox' ? 'font-semibold text-gray-900' : 'text-gray-600'
                              }`}>
                                {message.subject || 'No Subject'}
                              </p>
                              <p className="text-sm text-gray-500 truncate">
                                {message.content}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Compose Modal */}
        {showCompose && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">New Message</h2>
                <button
                  onClick={() => setShowCompose(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaTimes className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleSendMessage} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To
                  </label>
                  <div className="relative">
                    <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    />
                  </div>
                  {searchTerm && (
                    <div className="mt-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
                      {filteredUsers.map((u) => (
                        <button
                          key={u._id}
                          type="button"
                          onClick={() => {
                            setComposeForm({ ...composeForm, recipient: u._id });
                            setSearchTerm(u.name);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center space-x-3"
                        >
                          <FaUser className="text-gray-400" />
                          <div>
                            <p className="text-sm font-medium text-gray-900">{u.name}</p>
                            <p className="text-xs text-gray-500">{u.email}</p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={composeForm.subject}
                    onChange={(e) => setComposeForm({ ...composeForm, subject: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Enter subject"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message
                  </label>
                  <textarea
                    value={composeForm.content}
                    onChange={(e) => setComposeForm({ ...composeForm, content: e.target.value })}
                    required
                    rows="8"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-primary-500 focus:border-primary-500"
                    placeholder="Type your message..."
                  />
                </div>

                <div className="flex items-center justify-end space-x-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={() => setShowCompose(false)}
                    className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!composeForm.recipient || !composeForm.content}
                    className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    <FaPaperPlane />
                    <span>Send</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Messages;