import {redirect} from 'react-router';
import type {Route} from './+types/account_.reset-password';

export const meta: Route.MetaFunction = () => [{title: 'Restablecer contraseña | La Buhardilla'}];

export function loader() {
  return redirect('/account/login?notice=passwordless');
}

export default function ResetPassword() {
  return null;
}
