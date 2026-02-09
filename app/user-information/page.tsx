'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function UserInformation() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (!savedUser) { router.push('/login'); return; }
    const parsedUser = JSON.parse(savedUser);
    fetch(`/api/users/${parsedUser._id || parsedUser.id}`)
      .then(res => res.json())
      .then(data => { if (!data.error) setUser(data); });
  }, [router]);

  if (!user) return null;

  return (
    <div style={{
      backgroundColor: '#0e1621',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: 'sans-serif',
      color: 'white'
    }}>
      <div style={{
        backgroundColor: '#17212b',
        width: '100%',
        maxWidth: '400px',
        borderRadius: '20px',
        boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
        overflow: 'hidden'
      }}>
        {/* Header */}
        <div style={{ backgroundColor: '#242f3d', padding: '20px', textAlign: 'center', position: 'relative' }}>
          <button onClick={() => router.push('/dashboard')} style={{ position: 'absolute', left: '20px', background: 'none', border: 'none', color: '#6ab2f2', cursor: 'pointer', fontSize: '20px' }}>←</button>
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>User Info</span>
        </div>

        {/* Profile Section */}
        <div style={{ padding: '30px', textAlign: 'center', borderBottom: '1px solid #0e1621' }}>
          <div style={{
            width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#3390ec',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '40px', fontWeight: 'bold', margin: '0 auto 15px',
            boxShadow: '0 5px 15px rgba(0,0,0,0.3)'
          }}>
            {user.username?.[0].toUpperCase()}
          </div>
          <h2 style={{ margin: '0', fontSize: '24px' }}>{user.username}</h2>
          <p style={{ color: '#6ab2f2', fontSize: '13px', marginTop: '5px', fontWeight: 'bold' }}>ONLINE</p>
        </div>

        {/* Details List */}
        <div style={{ padding: '10px 20px' }}>
          <InfoItem label="Username" value={`@${user.username}`} />
          <InfoItem label="Email" value={user.email} />
          <InfoItem label="Joined" value={new Date(user.createdAt).toLocaleDateString()} />
          <InfoItem label="Friends" value={`${user.friends?.length || 0} Contacts`} isLast />
        </div>

        {/* Footer Button */}
        <div style={{ padding: '20px' }}>
          <button onClick={() => router.push('/dashboard')} style={{
            width: '100%', padding: '15px', borderRadius: '12px', border: 'none',
            backgroundColor: '#3390ec', color: 'white', fontWeight: 'bold',
            cursor: 'pointer', fontSize: '16px'
          }}>
            BACK TO CHAT
          </button>
        </div>
      </div>
    </div>
  );
}

function InfoItem({ label, value, isLast = false }: any) {
  return (
    <div style={{
      padding: '15px 0',
      borderBottom: isLast ? 'none' : '1px solid rgba(255,255,255,0.05)',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <span style={{ color: 'white', fontSize: '15px', fontWeight: '500' }}>{value}</span>
      <span style={{ color: '#808b97', fontSize: '11px', fontWeight: 'bold', marginTop: '3px', textTransform: 'uppercase' }}>{label}</span>
    </div>
  );
}