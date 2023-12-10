import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from 'react-router-dom';

const SidebarLink = styled(Link)`
  display: flex;
  color: #e1e9fc;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  list-style: none;
  height: 60px;
  text-decoration: none;
  font-size: 18px;

  &:hover {
    background: #252831;
    border-left: 4px solid #414757;
    cursor: pointer;
    text-decoration: none;

  }
`;

const SidebarLabel = styled.span`
  margin-left: 16px;
`;

const DropdownLink = styled(Link)`
  background: #414757;
  height: 60px;
  padding-left: 3rem;
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #f5f5f5;
  font-size: 18px;

  &:hover {
    background: #55535a;
    cursor: pointer;
  }
`;

const SubMenu = ({ item }) => {
  const [subnav, setSubnav] = useState(false);
  const navigate = useNavigate();
  const showSubnav = () => setSubnav(!subnav);
  const token = localStorage.getItem('token');
  let decodedUser;
  if (token) {
    decodedUser = jwtDecode(token);
  }
  else {
    navigate('/login')
  }
  const handleLogout = () => {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        navigate('/login');
        return;
      }

      axios
        .post(
          'http://localhost:3001/logout',
          null,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
        .then(() => {
          localStorage.removeItem('token');
          navigate('/login');
        })
        .catch((error) => {
          console.error('Logout failed:', error);
        });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  return (
    <>
      {(!item.type || (decodedUser && item.type === decodedUser.type)) && (
        <SidebarLink to={item.path} onClick={item.title === 'Logout' ? handleLogout : (item.subNav && showSubnav)}>
          <div>
            {item.icon}
            <SidebarLabel>{item.title}</SidebarLabel>
          </div>
          <div>
            {item.subNav && subnav ? item.iconOpened : item.subNav ? item.iconClosed : null}
          </div>
        </SidebarLink>
      )}
      {subnav &&
        item.subNav.map((subItem, index) => {
          return (
            <DropdownLink to={subItem.path} key={index}>
              {subItem.icon}
              <SidebarLabel>{subItem.title}</SidebarLabel>
            </DropdownLink>
          );
        })}
    </>
  );
};

export default SubMenu;