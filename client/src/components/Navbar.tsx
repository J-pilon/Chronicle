import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from '../hooks/UserContext';
import styled from 'styled-components'

function Navbar() {
  const { userRef } = useContext(UserContext);
  const user = userRef.current;
  const Button = styled.button`
  background: ${ user ? user.background_hex : 'white' };
  color: ${ user ? user.text_hex : 'darkgrey' };
  border: none;
  font-size: 1em;
  text-decoration: none;
  height: 3em;
  padding-right: 1em;
  padding-left: 1em;
  border-radius: 4px;
  margin-left: 1em;
  :hover {
    color: ${ user ? user.text_hex : 'darkgrey' };
    background: ${ user ? user.accent_hex : 'yellow' };
    box-shadow: 0px 0px 1px 1px ${user ? user.accent_hex : 'yellow'}
  }`;

  return (
    <div className='Navbar'>

      <img src="images/ChronicleLogo.png" 
        alt="logo" 
        style={{height:'190%', marginTop: '1.6em'}}/>
      <div className='Navbar-Buttons'>
        <Link to="/"><Button>Chronicle Your Day </Button></Link>
        <Link to="/entries"><Button>Entries</Button></Link>
        <Link to="/settings"><Button>Settings</Button></Link>
        <Link to="/graphs"><Button>Graphs</Button></Link>
        {!user 
        ? <><Link to="/login"><Button>Login</Button></Link>
        <Link to="/si-up"><Button>Sign up</Button></Link></>
        : <Link to="/logout"><Button>Logout</Button></Link>}
      </div>
    </div>
  );
}

export default Navbar;