import Link from 'next/link';

const Sidebar = () => {
  return (
    <div style={{ width: '250px', background: '#333', color: '#fff', padding: '20px' }}>
      <h2>Menu</h2>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        <li>
          <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        </li>
        <li>
          <Link href="/editor" style={{ color: '#fff', textDecoration: 'none' }}>Editor</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
