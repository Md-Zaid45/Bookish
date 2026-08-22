import Image from 'next/image';
import { memo } from 'react';

const Sidebar = () => {
  return (
    <div className='admin-sidebar'>
      <div className='logo'>
        <Image src='/icons/admin/logo.svg' alt='logo' width={37} height={37}></Image>
      <h1>Bookish</h1>
      </div>
      <div className='mt-10 flex flex-col gap-5'></div>
    </div>
  );
};

export default Sidebar;