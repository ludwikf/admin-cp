import React from "react";
import Image from "next/image";

export default function PostImage({ source }: any) {
  const defaultImage =
    "https://firebasestorage.googleapis.com/v0/b/test-admincp.appspot.com/o/no-image-icon-2048x2048-2t5cx953.png?alt=media&token=91f72576-e73e-4274-90c2-c8f25b0f94de";
  let imageStyle = { width: "100%", height: "100%" };
  const isDefaultImage = source === defaultImage;

  if (isDefaultImage) {
    imageStyle = { width: "75px", height: "75px" };
  }
  return (
    <>
      <Image
        rel="stylesheet preload prefetch"
        src={source}
        alt="img"
        width={0}
        height={0}
        sizes="100vw"
        priority={isDefaultImage ? false : true}
        style={imageStyle}
        className={`rounded-xl object-cover object-left`}
      />
    </>
  );
}
