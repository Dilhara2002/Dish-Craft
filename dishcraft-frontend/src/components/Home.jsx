import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    const [recipePosts, setRecipePosts] = useState([
        {
            id: 1,
            user: 'Chef Maria',
            avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
            time: '2 hours ago',
            image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Spicy Thai Basil Chicken',
            likes: 124,
            comments: 23,
            shares: 7,
            description: 'A delicious and authentic Thai dish with a perfect balance of spicy, sweet, and savory flavors.'
        },
        {
            id: 2,
            user: 'Chef John',
            avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
            time: '5 hours ago',
            image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Fresh Veggie Salad Bowl',
            likes: 89,
            comments: 15,
            shares: 4,
            description: 'A healthy and colorful salad packed with fresh vegetables and a light vinaigrette dressing.'
        },
        {
            id: 3,
            user: 'Baking Queen',
            avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
            time: '1 day ago',
            image: 'https://images.unsplash.com/photo-1484723091739-30a097e8f929?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
            title: 'Homemade Cinnamon Rolls',
            likes: 215,
            comments: 42,
            shares: 18,
            description: 'Soft, fluffy cinnamon rolls with cream cheese frosting - perfect for weekend brunch!'
        }
    ]);

    const [newTitle, setNewTitle] = useState('');
    const [newImage, setNewImage] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingPost, setEditingPost] = useState(null);
    const [editTitle, setEditTitle] = useState('');
    const [editImage, setEditImage] = useState('');
    const [editDescription, setEditDescription] = useState('');

    const handleAddRecipe = () => {
        if (!newTitle.trim() || !newImage.trim()) return;

        const newRecipe = {
            id: Date.now(),
            user: 'You',
            avatar: 'https://randomuser.me/api/portraits/lego/1.jpg',
            time: 'Just now',
            image: newImage,
            title: newTitle,
            description: newDescription,
            likes: 0,
            comments: 0,
            shares: 0
        };

        setRecipePosts([newRecipe, ...recipePosts]);
        setNewTitle('');
        setNewImage('');
        setNewDescription('');
    };

    const handleDeleteRecipe = (id) => {
        setRecipePosts(recipePosts.filter(post => post.id !== id));
    };

    const handleEditRecipe = (post) => {
        setEditingPost(post.id);
        setEditTitle(post.title);
        setEditImage(post.image);
        setEditDescription(post.description);
    };

    const handleUpdateRecipe = () => {
        if (!editTitle.trim() || !editImage.trim()) return;

        setRecipePosts(recipePosts.map(post => 
            post.id === editingPost 
                ? { 
                    ...post, 
                    title: editTitle, 
                    image: editImage, 
                    description: editDescription,
                    time: 'Just now (edited)'
                } 
                : post
        ));

        setEditingPost(null);
        setEditTitle('');
        setEditImage('');
        setEditDescription('');
    };

    const handleCancelEdit = () => {
        setEditingPost(null);
        setEditTitle('');
        setEditImage('');
        setEditDescription('');
    };

    const styles = {
        container: {
            display: 'flex',
            justifyContent: 'center',
            backgroundImage: 'url("https://cdn.pixabay.com/photo/2018/04/13/17/12/vegetable-skewer-3317055_1280.jpg")',
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center center',
            minHeight: '100vh',
            padding: '20px 0',
            fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
        },
        mainContent: {
            width: '100%',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '0 15px'
        },
        createPost: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '40px',
            marginBottom: '20px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)'
        },
        postInput: {
            width: '100%',
            padding: '12px 15px',
            marginBottom: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#f9f9f9',
            transition: 'border 0.3s ease',
            outline: 'none',
            '&:focus': {
                borderColor: '#ff6b6b',
                backgroundColor: '#fff'
            }
        },
        inputField: {
            width: '100%',
            padding: '12px 15px',
            marginBottom: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#f9f9f9',
            transition: 'border 0.3s ease',
            outline: 'none',
            '&:focus': {
                borderColor: '#ff6b6b',
                backgroundColor: '#fff'
            }
        },
        postButton: {
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
            width: '100%',
            '&:hover': {
                backgroundColor: '#ff5252'
            }
        },
        recipePost: {
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            marginBottom: '20px',
            overflow: 'hidden',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease',
            '&:hover': {
                transform: 'translateY(-2px)'
            }
        },
        postHeader: {
            display: 'flex',
            alignItems: 'center',
            padding: '15px',
            borderBottom: '1px solid #f0f0f0'
        },
        avatar: {
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            objectFit: 'cover',
            marginRight: '12px'
        },
        userInfo: {
            flex: '1'
        },
        userName: {
            margin: '0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#333'
        },
        postTime: {
            margin: '0',
            fontSize: '12px',
            color: '#999'
        },
        postImage: {
            width: '100%',
            height: '300px',
            objectFit: 'cover',
            borderBottom: '1px solid #f0f0f0',
            borderTop: '1px solid #f0f0f0'
        },
        postContent: {
            padding: '15px'
        },
        postTitle: {
            margin: '0 0 10px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333'
        },
        postDescription: {
            margin: '0',
            fontSize: '14px',
            color: '#666',
            lineHeight: '1.5'
        },
        postActions: {
            display: 'flex',
            justifyContent: 'space-between',
            padding: '10px 15px',
            borderTop: '1px solid #f0f0f0'
        },
        actionButton: {
            backgroundColor: 'transparent',
            border: 'none',
            color: '#666',
            padding: '8px 12px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            transition: 'all 0.3s ease',
            '&:hover': {
                backgroundColor: '#f5f5f5',
                color: '#ff6b6b'
            }
        },
        exploreButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '12px 20px',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: '600',
            transition: 'background-color 0.3s ease',
            width: '100%',
            marginTop: '20px',
            '&:hover': {
                backgroundColor: '#3e8e41'
            }
        },
        formTitle: {
            margin: '0 0 15px 0',
            fontSize: '18px',
            fontWeight: '600',
            color: '#333',
            textAlign: 'center'
        },
        textarea: {
            width: '100%',
            padding: '12px 15px',
            marginBottom: '10px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            fontSize: '14px',
            backgroundColor: '#f9f9f9',
            minHeight: '80px',
            resize: 'vertical',
            outline: 'none',
            transition: 'border 0.3s ease',
            '&:focus': {
                borderColor: '#ff6b6b',
                backgroundColor: '#fff'
            }
        },
        editForm: {
            padding: '15px',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            margin: '10px 0',
            backgroundColor: '#f9f9f9'
        },
        buttonGroup: {
            display: 'flex',
            gap: '10px',
            marginTop: '10px'
        },
        updateButton: {
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            flex: '1',
            '&:hover': {
                backgroundColor: '#3e8e41'
            }
        },
        cancelButton: {
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            flex: '1',
            '&:hover': {
                backgroundColor: '#d32f2f'
            }
        },
        deleteButton: {
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            '&:hover': {
                backgroundColor: '#d32f2f'
            }
        },
        editButton: {
            backgroundColor: '#2196F3',
            color: 'white',
            border: 'none',
            padding: '8px 15px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            '&:hover': {
                backgroundColor: '#0b7dda'
            }
        },
        userActions: {
            display: 'flex',
            gap: '10px'
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.mainContent}>
                {/* 🔥 Add New Recipe Section */}
                <div style={styles.createPost}>
                    <h3 style={styles.formTitle}>Add New Recipe</h3>
                    <input
                        type="text"
                        placeholder="Recipe title"
                        style={styles.inputField}
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Image URL"
                        style={styles.inputField}
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                    />
                    <textarea
                        placeholder="Recipe description"
                        style={styles.textarea}
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                    />
                    <button style={styles.postButton} onClick={handleAddRecipe}>
                        Add Recipe
                    </button>
                </div>

                {/* 🧑‍🍳 Recipe Feed */}
                {recipePosts.map(post => (
                    <div key={post.id} style={styles.recipePost}>
                        <div style={styles.postHeader}>
                            <img src={post.avatar} alt={post.user} style={styles.avatar} />
                            <div style={styles.userInfo}>
                                <h3 style={styles.userName}>{post.user}</h3>
                                <p style={styles.postTime}>{post.time}</p>
                            </div>
                            {post.user === 'You' && (
                                <div style={styles.userActions}>
                                    <button 
                                        style={styles.editButton} 
                                        onClick={() => handleEditRecipe(post)}
                                    >
                                        Edit
                                    </button>
                                    <button 
                                        style={styles.deleteButton} 
                                        onClick={() => handleDeleteRecipe(post.id)}
                                    >
                                        Delete
                                    </button>
                                </div>
                            )}
                        </div>
                        
                        {editingPost === post.id ? (
                            <div style={styles.editForm}>
                                <input
                                    type="text"
                                    placeholder="Recipe title"
                                    style={styles.inputField}
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                />
                                <input
                                    type="text"
                                    placeholder="Image URL"
                                    style={styles.inputField}
                                    value={editImage}
                                    onChange={(e) => setEditImage(e.target.value)}
                                />
                                <textarea
                                    placeholder="Recipe description"
                                    style={styles.textarea}
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                />
                                <div style={styles.buttonGroup}>
                                    <button 
                                        style={styles.updateButton} 
                                        onClick={handleUpdateRecipe}
                                    >
                                        Update
                                    </button>
                                    <button 
                                        style={styles.cancelButton} 
                                        onClick={handleCancelEdit}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <img src={post.image} alt={post.title} style={styles.postImage} />
                                <div style={styles.postContent}>
                                    <h3 style={styles.postTitle}>{post.title}</h3>
                                    <p style={styles.postDescription}>{post.description}</p>
                                </div>
                            </>
                        )}
                        
                        <div style={styles.postActions}>
                            <button style={styles.actionButton}>
                                <span>👍</span> Like ({post.likes})
                            </button>
                            <button style={styles.actionButton}>
                                <span>💬</span> Comment ({post.comments})
                            </button>
                            <button style={styles.actionButton}>
                                <span>↗️</span> Share ({post.shares})
                            </button>
                        </div>
                    </div>
                ))}

                {/* 🌍 Explore Button */}
                <button
                    style={styles.exploreButton}
                    onClick={() => navigate('/recipes')}
                >
                    Explore More Recipes
                </button>
            </div>
        </div>
    );
};

export default Home;