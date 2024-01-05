import createSupabaseServerClient from '@/lib/supabase/server/supabaseServerClient';
import { Contributions } from '@/models/database';
import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';

const supabase = createSupabaseServerClient();
// export async function POST(request: Request) {
//   const data = await request.json();

//   if (!data) return NextResponse.error();

//   const { data: test, error } = await supabase
//     .from<'contributions', Contributions>('contributions')
//     .insert({
//       id: uuidv4(),
//       value: 0,
//       description: '',
//       donor: '',
//       type: 'BANK',
//       contribution_date: new Date().toISOString(),
//     });

//   if (error) return NextResponse.json({ msg: error.message });
//   return NextResponse.json({ msg: 'Hello from server' });
// }

export async function PATCH(request: Request) {
  const data = await request.json();
  if (!data) return NextResponse.error();

  const { error } = await supabase
    .from<'contributions', Contributions>('contributions')
    .update({
      //       value: 0,
      //       description: '',
      //       donor: '',
      //       type: 'BANK',
      // value,
      // donor,
      // description,
      // type,
      // contribution_date: contribution_date.toISOString(),
    })
    .eq('id', 1); // TODO change here

  if (error) return false;
  return true;
}
