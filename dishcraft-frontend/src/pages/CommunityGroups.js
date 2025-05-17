import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { FaUsers, FaPlus, FaTrash, FaEdit, FaCheck, FaTimes } from 'react-icons/fa';
import moment from 'moment';

const CommunityGroups = () => {
  const [groups, setGroups] = useState([]);
  const [newGroup, setNewGroup] = useState({ name: '', description: '' });
  const [editingGroup, setEditingGroup] = useState({ id: null, name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const username = localStorage.getItem('username');
  const navigate = useNavigate();

  useEffect(() => {
    fetchGroups();
  }, []);

  const fetchGroups = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/groups', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setGroups(response.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching groups:', err);
      setLoading(false);
    }
  };

  const handleCreateGroup = async () => {
    try {
      await axios.post('http://localhost:8080/api/groups', newGroup, {
        headers: { Authorization: `Bearer ${token}`, userId }
      });
      setNewGroup({ name: '', description: '' });
      fetchGroups();
    } catch (err) {
      console.error('Error creating group:', err);
    }
  };

  const startEditingGroup = (group) => {
    setEditingGroup({ id: group.id, name: group.name, description: group.description });
  };

  const cancelEditing = () => {
    setEditingGroup({ id: null, name: '', description: '' });
  };

  const handleUpdateGroup = async () => {
    try {
      await axios.put(`http://localhost:8080/api/groups/${editingGroup.id}`, editingGroup, {
        headers: { Authorization: `Bearer ${token}`, userId }
      });
      cancelEditing();
      fetchGroups();
    } catch (err) {
      console.error('Error updating group:', err);
    }
  };

  const confirmDeleteGroup = (group) => {
    setGroupToDelete(group);
    setShowDeleteModal(true);
  };

  const handleDeleteGroup = async () => {
    try {
      await axios.delete(`http://localhost:8080/api/groups/${groupToDelete.id}`, {
        headers: { Authorization: `Bearer ${token}`, userId }
      });
      setShowDeleteModal(false);
      fetchGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(`http://localhost:8080/api/groups/${groupId}/join`, null, {
        headers: { Authorization: `Bearer ${token}`, userId }
      });
      fetchGroups();
    } catch (err) {
      console.error('Error joining group:', err);
    }
  };

  const isGroupCreator = (group) => {
    return group.members && group.members.length > 0 && group.members[0] === userId;
  };

  const isGroupMember = (group) => {
    return group.members && group.members.includes(userId);
  };

  if (loading) return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      fontSize: '1.5rem',
      color: '#666',
      backgroundColor: '#f5f7fa'
    }}>
      Loading groups...
    </div>
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '30px 20px',
      backgroundColor: '#f5f7fa',
      minHeight: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    }}>
      {/* Create Group Form */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '25px',
        marginBottom: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e1e5eb'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#2d3748',
          fontSize: '1.5rem',
          fontWeight: '600'
        }}>Create New Group</h3>
        <div style={{ 
          display: 'flex', 
          gap: '15px', 
          marginBottom: '20px',
          flexDirection: 'column'
        }}>
          <input
            type="text"
            placeholder="Group name"
            style={{
              padding: '12px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':focus': {
                borderColor: '#4299e1'
              }
            }}
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)"
            style={{
              padding: '12px 15px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              fontSize: '1rem',
              minHeight: '100px',
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s',
              ':focus': {
                borderColor: '#4299e1'
              }
            }}
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          />
        </div>
        <button
          style={{
            backgroundColor: '#4299e1',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '8px',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500',
            transition: 'background-color 0.2s, transform 0.2s',
            ':hover': {
              backgroundColor: '#3182ce',
              transform: 'translateY(-1px)'
            },
            ':active': {
              transform: 'translateY(0)'
            }
          }}
          onClick={handleCreateGroup}
        >
          Create Group
        </button>
      </div>

      {groups.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '50px 20px',
          backgroundColor: 'white',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e1e5eb',
          marginBottom: '30px'
        }}>
          <p style={{ 
            fontSize: '1.2rem', 
            color: '#718096',
            margin: '0'
          }}>No groups found. Create your first group!</p>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
        gap: '25px',
        marginTop: '20px'
      }}>
        {groups.map((group) => (
          <div key={group.id} style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            overflow: 'hidden',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            border: '1px solid #e1e5eb',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 10px 15px rgba(0, 0, 0, 0.1)'
            }
          }}>
            <div style={{ padding: '25px' }}>
              {editingGroup.id === group.id ? (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        fontSize: '1rem',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        ':focus': {
                          borderColor: '#4299e1'
                        }
                      }}
                      value={editingGroup.name}
                      onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                    />
                    <textarea
                      style={{
                        width: '100%',
                        padding: '12px 15px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        minHeight: '100px',
                        fontSize: '1rem',
                        resize: 'vertical',
                        outline: 'none',
                        transition: 'border-color 0.2s',
                        ':focus': {
                          borderColor: '#4299e1'
                        }
                      }}
                      value={editingGroup.description}
                      onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '12px'
                  }}>
                    <button 
                      style={{
                        border: 'none',
                        backgroundColor: '#48bb78',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={handleUpdateGroup}
                    >
                      <FaCheck size={14} /> Save
                    </button>
                    <button 
                      style={{
                        border: 'none',
                        backgroundColor: '#a0aec0',
                        color: 'white',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '0.9rem',
                        fontWeight: '500',
                        transition: 'background-color 0.2s'
                      }}
                      onClick={cancelEditing}
                    >
                      <FaTimes size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{
                    margin: '0 0 15px 0',
                    color: '#2d3748',
                    fontSize: '1.4rem',
                    fontWeight: '600',
                    lineHeight: '1.3'
                  }}>
                    {group.name}
                  </h3>
                  
                  <p style={{
                    color: '#4a5568',
                    fontSize: '1rem',
                    marginBottom: '20px',
                    lineHeight: '1.5'
                  }}>
                    {group.description || 'No description provided'}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '20px',
                    gap: '10px',
                    color: '#718096'
                  }}>
                    <FaUsers size={18} />
                    <span style={{ fontSize: '0.95rem' }}>
                      {group.members?.length || 0} members
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '12px',
                    marginTop: '25px',
                    flexWrap: 'wrap'
                  }}>
                    {!isGroupMember(group) ? (
                      <button
                        style={{
                          backgroundColor: '#38b2ac',
                          color: 'white',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'pointer',
                          flex: '1 1 auto',
                          minWidth: '120px',
                          fontSize: '0.95rem',
                          fontWeight: '500',
                          transition: 'background-color 0.2s, transform 0.2s',
                          ':hover': {
                            backgroundColor: '#319795',
                            transform: 'translateY(-1px)'
                          }
                        }}
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join Group
                      </button>
                    ) : (
                      <button
                        style={{
                          backgroundColor: '#cbd5e0',
                          color: '#4a5568',
                          padding: '10px 20px',
                          borderRadius: '8px',
                          border: 'none',
                          cursor: 'not-allowed',
                          flex: '1 1 auto',
                          minWidth: '120px',
                          fontSize: '0.95rem',
                          fontWeight: '500'
                        }}
                        disabled
                      >
                        Already Joined
                      </button>
                    )}

                    {isGroupCreator(group) && (
                      <>
                        <button
                          style={{
                            backgroundColor: '135deg, #3498db, #2980b9',
                            color: '#975a16',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            flex: '0 1 auto',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s, transform 0.2s',
                            ':hover': {
                              backgroundColor: '#ecc94b',
                              transform: 'translateY(-1px)'
                            }
                          }}
                          onClick={() => startEditingGroup(group)}
                        >
                          <FaEdit size={14} /> 
                        </button>
                        <button
                          style={{
                            backgroundColor: '#f56565',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px',
                            flex: '0 1 auto',
                            fontSize: '0.95rem',
                            fontWeight: '500',
                            transition: 'background-color 0.2s, transform 0.2s',
                            ':hover': {
                              backgroundColor: '#e53e3e',
                              transform: 'translateY(-1px)'
                            }
                          }}
                          onClick={() => confirmDeleteGroup(group)}
                        >
                          <FaTrash size={14} /> 
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000,
          backdropFilter: 'blur(3px)'
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '25px',
            borderRadius: '12px',
            width: '450px',
            maxWidth: '90%',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.2)'
          }}>
            <h3 style={{ 
              margin: '0 0 20px 0',
              color: '#2d3748',
              fontSize: '1.3rem'
            }}>Confirm Delete</h3>
            <p style={{
              color: '#4a5568',
              margin: '0 0 25px 0',
              lineHeight: '1.5'
            }}>Are you sure you want to delete the group "{groupToDelete?.name}"? This action cannot be undone.</p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '15px'
            }}>
              <button
                style={{
                  backgroundColor: '#e2e8f0',
                  color: '#4a5568',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s'
                }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: '#f56565',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                  fontWeight: '500',
                  transition: 'background-color 0.2s',
                  ':hover': {
                    backgroundColor: '#e53e3e'
                  }
                }}
                onClick={handleDeleteGroup}
              >
                Delete Group
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGroups;