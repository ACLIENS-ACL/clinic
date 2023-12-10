import React from 'react';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { MdOutlineFamilyRestroom } from "react-icons/md";
import { FaUsersViewfinder } from "react-icons/fa6";
import { IoPersonAddSharp } from "react-icons/io5";
import { TbHealthRecognition } from "react-icons/tb";
import { RiHealthBookFill } from "react-icons/ri";
import { RiFileHistoryFill } from "react-icons/ri";
import { RiLockPasswordFill } from "react-icons/ri";
import { MdManageAccounts } from "react-icons/md";
export const SidebarData = [
  {
    title: 'Home',
    type: 'patient',
    icon: <AiIcons.AiFillHome />,
    path: '/patient'
  },
  {
    title: 'Home',
    type: 'admin',
    icon: <AiIcons.AiFillHome />,
    path: '/admin'
  },
  {
    title: 'Home',
    type: 'doctor',
    icon: <AiIcons.AiFillHome />,
    path: '/doctor'
  },
  {
    title: 'Family Members',
    type: 'patient',
    icon: <MdOutlineFamilyRestroom />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'Add Members',
        path: '/addFamilyMembers',
        icon: <IoPersonAddSharp />,
        cName: 'sub-nav'
      },
      {
        title: 'View Members',
        path: '/myFamilyMembers',
        icon: <FaUsersViewfinder />,
        cName: 'sub-nav'
      }
    ]
  },
  {
    title: 'Appointments',
    type: 'patient',
    icon: <MdOutlineFamilyRestroom />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'Reserve an Appointment',
        path: '/listdoctors',
        icon: <FaIcons.FaFileMedical />,
        cName: 'sub-nav'
      },
      {
        title: 'View Appointments',
        path: '/myPAppointments',
        icon: <FaIcons.FaBookMedical />,
        cName: 'sub-nav'
      }
    ]
  },
  {
    title: 'Health Packages',
    type: 'patient',
    icon: <MdOutlineFamilyRestroom />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,
    subNav: [
      {
        title: 'Subscribe to a Package',
        path: '/healthPackages',
        icon: <IoIcons.IoIosBody />,
        cName: 'sub-nav'
      },
      {
        title: 'View my Subscriptions',
        path: '/mySubscription',
        icon: <TbHealthRecognition />,
        cName: 'sub-nav'
      }
    ]
  },
  {
    title: 'Health Records',
    type: 'patient',
    path: '/viewHealthRecords',
    icon: <RiHealthBookFill />
  },
  {
    title: 'Medical History',
    type: 'patient',
    path: '/modifyMedicalRecord',
    icon: <RiFileHistoryFill />
  },
  {
    title: 'Prescriptions',
    type: 'patient',
    path: '/myPrescriptions',
    icon: <FaIcons.FaPrescriptionBottleAlt />
  },


  {
    title: 'Register Admins',
    type: 'admin',
    path: '/register-admin',
    icon: <FaIcons.FaPrescriptionBottleAlt />
  },
  {
    title: 'Edit Users',
    icon: <MdManageAccounts />,
    type: 'admin',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Edit Admins',
        path: '/edit-admins',
        icon: <RiLockPasswordFill />
      },
      {
        title: 'Edit Doctors',
        path: '/edit-doctors',
        icon: <RiLockPasswordFill />
      },
      {
        title: 'Edit Patients',
        path: '/edit-patients',
        icon: <RiLockPasswordFill />
      },
    ]
  },
  {
    title: 'Doctors Requests',
    type: 'admin',
    path: '/view-requests',
    icon: <FaIcons.FaPrescriptionBottleAlt />
  },
  {
    title: 'Health Packages',
    icon: <MdManageAccounts />,
    type: 'admin',
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Add Health Package',
        path: '/modify-packages',
        icon: <RiLockPasswordFill />
      },
      {
        title: 'Modify Health Package',
        path: '/modifyPackages',
        icon: <RiLockPasswordFill />
      }
    ]
  },








  {
    title: 'Account',
    icon: <MdManageAccounts />,
    iconClosed: <RiIcons.RiArrowDownSFill />,
    iconOpened: <RiIcons.RiArrowUpSFill />,

    subNav: [
      {
        title: 'Change Password',
        path: '/changePassword',
        icon: <RiLockPasswordFill />
      }
    ]
  },
  {
    title: 'Logout',
    path: '/',
    icon: <FaIcons.FaPrescriptionBottleAlt />
  },
];
