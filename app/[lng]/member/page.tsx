const BeAMemberPage = ({ params: { lng } }: { params: { lng: string } }) => {
  return (
    <div className='mx-auto mt-10 flex flex-col gap-5'>
      <div className='flex flex-col gap-2'>
        <iframe
          src='https://giphy.com/embed/Mah9dFWo1WZX0WM62Q'
          width='480'
          height='480'
          frameBorder='0'
          className='giphy-embed mx-auto'
          allowFullScreen
        ></iframe>
      </div>
      <h3 className='mx-auto'>Check back later!</h3>
    </div>
  );
};

export default BeAMemberPage;
