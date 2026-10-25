import {redirect} from 'react-router';
import type {Route} from './+types/account_.recover';

export const meta: Route.MetaFunction = () => [{title: 'Recuperar acceso | La Buhardilla'}];

export function loader() {
  return redirect('/account/login?notice=passwordless');
}

export default function Recover() {
  return null;
}
