import React from 'react';
import { createFileRoute } from '@tanstack/react-router';
import AddMoneyScreen from '../screens/AddMoneyScreen';

export const Route = createFileRoute('/add-money')({
  component: AddMoneyScreen,
});

export default Route;
