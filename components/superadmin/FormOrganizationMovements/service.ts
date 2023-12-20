'use client';

import { v4 as uuidv4 } from 'uuid';
import createSupabaseBrowserClient from '@/lib/supabase/client/supabaseClient';
import { OrganizationMovements } from '@/models/database';
import { toast } from 'react-toastify';
import { OrganizationMovementAPIMessages } from './config';
import { OrganizationMovementFormProps } from './FormOrganizationMovements';

const addOrganizationMovement = async ({
  description,
  value,
  type,
  paid,
  movement_date,
}: OrganizationMovementFormProps) => {
  const supabase = createSupabaseBrowserClient();
  const { data } = await supabase.auth.getUser();
  if (!data || !data.user)
    return toast.error(OrganizationMovementAPIMessages.NO_USER_LOGGED_IN);

  const { error } = await supabase
    .from<'organization_movements', OrganizationMovements>(
      'organization_movements'
    )
    .insert({
      id: uuidv4(),
      description,
      value,
      type,
      paid,
      movement_date: movement_date.toISOString(),
      registered_by: data.user.id,
    });

  if (error) return toast.error(OrganizationMovementAPIMessages.ERROR);
  toast.success(OrganizationMovementAPIMessages.SUCCESS);
};

const updateOrganizationMovement = async ({
  description,
  value,
  type,
  movement_date,
}: OrganizationMovementFormProps) => {
  const supabase = createSupabaseBrowserClient();
  const { error } = await supabase
    .from<'organization_movements', OrganizationMovements>(
      'organization_movements'
    )
    .update({
      description,
      value,
      type,
      movement_date: movement_date.toISOString(),
    })
    .eq('id', 1);

  if (error) return;
  return true;
};

export { addOrganizationMovement, updateOrganizationMovement };
