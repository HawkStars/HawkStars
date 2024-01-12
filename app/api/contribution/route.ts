import createSupabaseServerClient from '@/lib/supabase/server/supabaseServerClient';
import { Contribution, Contributions } from '@/models/database';
import { NextResponse } from 'next/server';
import { z } from 'zod';

export type ContributionFormInput = Pick<
  Contribution,
  'value' | 'donor' | 'extra_info' | 'type'
> & { contribution_date: Date };

const contributionPatchSchema: z.ZodType<ContributionFormInput & { id: string }> = z.object({
  id: z.string(),
  value: z.number(),
  donor: z.string(),
  extra_info: z.string(),
  type: z.enum(['BANK']),
  contribution_date: z.date(),
});

export async function PATCH(request: Request) {
  const supabase = await createSupabaseServerClient();
  const json = await request.json();
  if (!json) return NextResponse.error();

  const parsedJSON = await contributionPatchSchema.safeParseAsync(json);
  if (!parsedJSON.success) return NextResponse.error();

  const contribution = parsedJSON.data;

  const { error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .update({
      value: contribution.value,
      extra_info: contribution.extra_info,
      type: contribution.type,
      contribution_date: contribution.contribution_date.toISOString(),
    })
    .eq('id', contribution.id); // TODO change here

  if (error) return NextResponse.error();
  return NextResponse.json({ status: true });
}
