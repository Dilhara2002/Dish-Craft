import React from 'react';

const Profile = () => {
  const user = {
    name: 'Jane Doe',
    email: 'jane@example.com',
    bio: 'Home cook. Passionate about sharing fusion dishes.',
    avatar: 'https://i.pravatar.cc/150?img=5',
    recipes: [
      { id: 1, title: 'Spicy Tofu Stir Fry', image: '/images/tofu.jpg' },
      { id: 2, title: 'Chocolate Lava Cake', image: '/images/lava.jpg' },
      { id: 3, title: 'Creamy Mushroom Pasta', image: '/images/pasta.jpg' },
    ]
  };

  const styles = {
    container: {
      minHeight: "100vh",
      background: "linear-gradient(to bottom right, #fff7ed, #fef3c7)",
      padding: "40px",
      display: "flex",
      flexDirection: "column",
      alignItems: "center"
    },
    card: {
      backgroundColor: "#ffffff",
      borderRadius: "16px",
      padding: "32px",
      maxWidth: "800px",
      width: "100%",
      boxShadow: "0 10px 20px rgba(0, 0, 0, 0.1)"
    },
    profileHeader: {
      display: "flex",
      alignItems: "center",
      marginBottom: "32px"
    },
    avatar: {
      width: "100px",
      height: "100px",
      borderRadius: "50%",
      objectFit: "cover",
      marginRight: "24px"
    },
    userInfo: {
      display: "flex",
      flexDirection: "column"
    },
    name: {
      fontSize: "24px",
      fontWeight: "700",
      marginBottom: "4px"
    },
    email: {
      fontSize: "14px",
      color: "#6b7280",
      marginBottom: "8px"
    },
    bio: {
      fontSize: "16px",
      color: "#374151"
    },
    sectionTitle: {
      fontSize: "20px",
      fontWeight: "600",
      marginBottom: "16px",
      marginTop: "32px"
    },
    recipeGrid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "16px"
    },
    recipeCard: {
      border: "1px solid #e5e7eb",
      borderRadius: "12px",
      overflow: "hidden",
      backgroundColor: "#fff",
      boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)"
    },
    recipeImage: {
      width: "100%",
      height: "140px",
      objectFit: "cover"
    },
    recipeTitle: {
      padding: "12px",
      fontSize: "16px",
      fontWeight: "500"
    },
    editButton: {
      marginTop: "16px",
      padding: "10px 20px",
      backgroundColor: "#f59e0b",
      color: "#fff",
      border: "none",
      borderRadius: "8px",
      cursor: "pointer",
      fontWeight: "500"
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={styles.profileHeader}>
          <img src={user.avatar} alt="Avatar" style={styles.avatar} />
          <div style={styles.userInfo}>
            <h2 style={styles.name}>{user.name}</h2>
            <p style={styles.email}>{user.email}</p>
            <p style={styles.bio}>{user.bio}</p>
            <button style={styles.editButton}>Edit Profile</button>
          </div>
        </div>

        <h3 style={styles.sectionTitle}>My Recipes</h3>
        <div style={styles.recipeGrid}>
          {user.recipes.map((recipe) => (
            <div key={recipe.id} style={styles.recipeCard}>
              <img src={recipe.image} alt={recipe.title} style={styles.recipeImage} />
              <p style={styles.recipeTitle}>{recipe.title}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
