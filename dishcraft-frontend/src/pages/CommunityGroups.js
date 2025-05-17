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
        headers: { Authorization: Bearer ${token} }
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
        headers: { Authorization: Bearer ${token}, userId }
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
      await axios.put(http://localhost:8080/api/groups/${editingGroup.id}, editingGroup, {
        headers: { Authorization: Bearer ${token}, userId }
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
      await axios.delete(http://localhost:8080/api/groups/${groupToDelete.id}, {
        headers: { Authorization: Bearer ${token}, userId }
      });
      setShowDeleteModal(false);
      fetchGroups();
    } catch (err) {
      console.error('Error deleting group:', err);
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await axios.post(http://localhost:8080/api/groups/${groupId}/join, null, {
        headers: { Authorization: Bearer ${token}, userId }
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
      color: '#666'
    }}>
      Loading groups...
    </div>
  );

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f8f9fa',
      minHeight: '100vh'
    }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '30px',
        paddingBottom: '15px',
        borderBottom: '1px solid #dee2e6'
      }}>
        <h2 style={{
          color: '#343a40',
          fontWeight: '600',
          margin: 0
        }}>Community Groups</h2>
        <button
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'all 0.3s',
            ':hover': {
              backgroundColor: '#218838',
              transform: 'translateY(-2px)'
            }
          }}
          onClick={() => navigate('/groups/create')}
        >
          <FaPlus /> Create New Group
        </button>
      </div>

      {/* Create Group Form */}
      <div style={{
        backgroundColor: 'white',
        borderRadius: '8px',
        padding: '20px',
        marginBottom: '30px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>Create New Group</h3>
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <input
            type="text"
            placeholder="Group name"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px'
            }}
            value={newGroup.name}
            onChange={(e) => setNewGroup({ ...newGroup, name: e.target.value })}
          />
          <input
            type="text"
            placeholder="Description (optional)"
            style={{
              flex: 1,
              padding: '8px 12px',
              border: '1px solid #ced4da',
              borderRadius: '4px'
            }}
            value={newGroup.description}
            onChange={(e) => setNewGroup({ ...newGroup, description: e.target.value })}
          />
        </div>
        <button
          style={{
            backgroundColor: '#007bff',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '4px',
            border: 'none',
            cursor: 'pointer',
            ':hover': {
              backgroundColor: '#0069d9'
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
          padding: '40px',
          backgroundColor: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <p style={{ fontSize: '1.2rem', color: '#6c757d' }}>No groups found. Create your first group!</p>
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
            borderRadius: '10px',
            overflow: 'hidden',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            transition: 'transform 0.3s, box-shadow 0.3s',
            ':hover': {
              transform: 'translateY(-5px)',
              boxShadow: '0 6px 16px rgba(0,0,0,0.15)'
            }
          }}>
            <div style={{ padding: '20px' }}>
              {editingGroup.id === group.id ? (
                <>
                  <div style={{ marginBottom: '15px' }}>
                    <input
                      type="text"
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                      value={editingGroup.name}
                      onChange={(e) => setEditingGroup({ ...editingGroup, name: e.target.value })}
                    />
                    <textarea
                      style={{
                        width: '100%',
                        padding: '8px 12px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        minHeight: '80px'
                      }}
                      value={editingGroup.description}
                      onChange={(e) => setEditingGroup({ ...editingGroup, description: e.target.value })}
                    />
                  </div>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end',
                    gap: '8px'
                  }}>
                    <button 
                      style={{
                        border: 'none',
                        backgroundColor: '#28a745',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={handleUpdateGroup}
                    >
                      <FaCheck size={12} /> Save
                    </button>
                    <button 
                      style={{
                        border: 'none',
                        backgroundColor: '#6c757d',
                        color: 'white',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                      onClick={cancelEditing}
                    >
                      <FaTimes size={12} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 style={{
                    margin: '0 0 10px 0',
                    color: '#212529',
                    fontSize: '1.3rem',
                    fontWeight: '600'
                  }}>
                    {group.name}
                  </h3>
                  
                  <p style={{
                    color: '#495057',
                    fontSize: '0.95rem',
                    marginBottom: '15px'
                  }}>
                    {group.description || 'No description provided'}
                  </p>

                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    marginBottom: '15px',
                    gap: '10px'
                  }}>
                    <FaUsers style={{ color: '#6c757d' }} />
                    <span style={{ color: '#6c757d', fontSize: '0.9rem' }}>
                      {group.members?.length || 0} members
                    </span>
                  </div>

                  <div style={{
                    display: 'flex',
                    gap: '10px',
                    marginTop: '15px'
                  }}>
                    {!isGroupMember(group) ? (
                      <button
                        style={{
                          backgroundColor: '#17a2b8',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'pointer',
                          flex: 1,
                          ':hover': {
                            backgroundColor: '#138496'
                          }
                        }}
                        onClick={() => handleJoinGroup(group.id)}
                      >
                        Join Group
                      </button>
                    ) : (
                      <button
                        style={{
                          backgroundColor: '#6c757d',
                          color: 'white',
                          padding: '8px 16px',
                          borderRadius: '4px',
                          border: 'none',
                          cursor: 'not-allowed',
                          flex: 1
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
                            backgroundColor: '#ffc107',
                            color: '#212529',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            ':hover': {
                              backgroundColor: '#e0a800'
                            }
                          }}
                          onClick={() => startEditingGroup(group)}
                        >
                          <FaEdit size={14} /> Edit
                        </button>
                        <button
                          style={{
                            backgroundColor: '#dc3545',
                            color: 'white',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            ':hover': {
                              backgroundColor: '#c82333'
                            }
                          }}
                          onClick={() => confirmDeleteGroup(group)}
                        >
                          <FaTrash size={14} /> Delete
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            padding: '20px',
            borderRadius: '8px',
            width: '400px',
            maxWidth: '90%'
          }}>
            <h3 style={{ marginTop: 0 }}>Confirm Delete</h3>
            <p>Are you sure you want to delete the group "{groupToDelete?.name}"?</p>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '10px',
              marginTop: '20px'
            }}>
              <button
                style={{
                  backgroundColor: '#6c757d',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
              <button
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '8px 16px',
                  borderRadius: '4px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                onClick={handleDeleteGroup}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommunityGroups;