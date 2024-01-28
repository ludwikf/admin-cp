import React from "react";

const FormatDate = (dateString: string, dict: any) => {
  const currentDate = new Date();
  const receivedDate = new Date(dateString);

  const today = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
  );

  const yesterday = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() - 1
  );

  const timeOptions: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
  };

  if (receivedDate.toDateString() === today.toDateString()) {
    return (
      <div className="text-[#999] flex items-center">
        <span className="md">{dict.today}</span>
        <span className="mx-2">| </span>
        <span className="text-lg lg:text-xl">
          {receivedDate.toLocaleTimeString([], timeOptions)}
        </span>
      </div>
    );
  } else if (receivedDate.toDateString() === yesterday.toDateString()) {
    return (
      <div className="text-[#999] flex items-center">
        <span className="md">{dict.yesterday}</span>
        <span className="mx-2">| </span>
        <span className="text-lg lg:text-xl">
          {receivedDate.toLocaleTimeString([], timeOptions)}
        </span>
      </div>
    );
  } else {
    return (
      <div className="text-[#999] flex items-center">
        <span className="md">{receivedDate.toLocaleDateString()}</span>
        <span className="mx-2">|</span>
        <span className="text-lg lg:text-xl">
          {receivedDate.toLocaleTimeString([], timeOptions)}
        </span>
      </div>
    );
  }
};

export default FormatDate;
