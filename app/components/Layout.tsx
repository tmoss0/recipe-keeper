import { NavLink } from '@remix-run/react';

function Layout() {
  return (
    <nav className='m-6'>
      <ul className='flex flex-row content-center items-end justify-center gap-6'>
        <li>
          <NavLink to='/' className='text-3xl'>
            Home
          </NavLink>
        </li>
        <li>
          <NavLink to='/search' className='text-3xl'>
            Search
          </NavLink>
        </li>
        <li>
          <NavLink to='/new-recipe' className='text-3xl'>
            New Recipe
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Layout;
