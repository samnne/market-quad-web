'use client';

import { useParams } from "next/navigation";


const CID = () => {
  const params = useParams()


  return <div>Conversation {params?.cid}</div>;
};

export default CID;
