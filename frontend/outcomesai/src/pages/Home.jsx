import { Auth } from 'aws-amplify';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  function signIn() {
    console.log('signIn');
    navigate('/login');
  }

  async function signOut() {
    console.log('Topbar signOut');
    try {
      await Auth.signOut();
      window.location.reload();
    } catch (error) {
      console.log('error signing out: ', error);
    }
  }
  return (
    <div>
      <h2>Home (Public)</h2>
      <button type='button' onClick={signIn} style={{ marginRight: '10px' }}>
        Sign In
      </button>
      <button type='button' onClick={signOut}>
        Sign Out
      </button>
    </div>
  );
}

export default Home;
