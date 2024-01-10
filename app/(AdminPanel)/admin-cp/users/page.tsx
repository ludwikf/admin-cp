"use client";
import React, { useEffect, useRef, useState } from "react";
import {
  TrashIcon,
  ArrowPathIcon,
  XMarkIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/solid";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import { LoadingSpinner } from "@/app/components/LoadingSpinner";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [userForm, setUserForm] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [editConfirm, setEditConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [userToEdit, setUserToEdit] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [page, setPage] = useState<number>(1);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const initialRender = useRef(true);
  const [initialFetchComplete, setInitialFetchComplete] = useState(false);

  const { data: session }: any = useSession();

  const fetchUsers = async (page: number) => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/get-users?page=${page}`);

      if (!res.ok) {
        throw new Error("Error fetching posts");
      }

      const data = await res.json();
      if (data.length === 0) {
        setHasMore(false);
      } else {
        setUsers((prevUsers) => [...prevUsers, ...data]);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHandler = async () => {
    if (hasMore) {
      if (!initialRender.current) {
        try {
          await fetchUsers(page);
        } catch (error) {
          console.error("Error fetching posts:", error);
        }
      } else {
        initialRender.current = false;
      }
    }
  };

  const handleRefreshUsers = async () => {
    setIsLoading(true);
    try {
      setUsers([]);
      setPage(1);
      setHasMore(true);
      setSearchQuery("");
      setSortOrder("");
      setSortBy("");

      fetchHandler();
    } catch (error) {
      throw new Error("Error refreshing users");
    } finally {
      setIsLoading(false);
    }
  };

  const handleScroll = () => {
    const { scrollTop, clientHeight, scrollHeight } =
      document.documentElement || document.body;

    if (scrollTop + clientHeight >= scrollHeight - 20) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const toggleSortOrder = (columnName: string) => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setSortBy(columnName);
  };

  const sortUsersByColumn = (columnName: string, usersArray: any[]) => {
    return usersArray.sort((a, b) => {
      const valueA = (a[columnName] || "").toLowerCase();
      const valueB = (b[columnName] || "").toLowerCase();

      if (sortOrder === "asc") {
        if (valueA < valueB) return -1;
        if (valueA > valueB) return 1;
      } else {
        if (valueA > valueB) return -1;
        if (valueA < valueB) return 1;
      }
      return 0;
    });
  };

  const sortUsersByCreatedAt = (usersArray: any[]) => {
    return usersArray.sort((a, b) => {
      const dateA = new Date(a.createdAt);
      const dateB = new Date(b.createdAt);

      if (sortOrder === "asc") {
        return dateA.getTime() - dateB.getTime();
      } else {
        return dateB.getTime() - dateA.getTime();
      }
    });
  };

  const filterUsers = (query: string) => {
    let filteredUsers = users;

    if (query) {
      filteredUsers = users.filter((user) => {
        return (
          (user.username || "").toLowerCase().includes(query.toLowerCase()) ||
          (user.email || "").toLowerCase().includes(query.toLowerCase()) ||
          (user.role || "").toLowerCase().includes(query.toLowerCase())
        );
      });
    }

    const uniqueUsers = filteredUsers.filter(
      (user, index) =>
        index === filteredUsers.findIndex((u) => u._id === user._id)
    );

    if (sortBy === "createdAt") {
      return sortUsersByCreatedAt(uniqueUsers);
    }
    return sortUsersByColumn(sortBy, uniqueUsers);
  };

  const editUser = (userId: any) => {
    setUserToEdit(userId);
    setEditConfirm(true);
  };
  const handleEditUser = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/edit-user-role?id=${userToEdit}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ session }),
      });
      if (response.ok) {
        window.location.reload();
        if (session.user._id == userToEdit) {
          signOut();
        } else {
          setEditConfirm(false);
        }
      } else {
        throw new Error("Failed to edit user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteUser = (userId: any) => {
    setUserToDelete(userId);
    setShowConfirm(true);
  };
  const handleDeleteUser = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/delete-user?id=${userToDelete}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Session: JSON.stringify(session),
        },
      });
      if (response.ok) {
        setUsers((prevUsers) =>
          prevUsers.filter((user) => user._id !== userToDelete)
        );
        if (session.user._id == userToDelete) {
          signOut();
        } else {
          setShowConfirm(false);
        }
      } else {
        throw new Error("Failed to delete user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isValidEmail = (email: string) => {
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    return emailRegex.test(email);
  };

  const handleAddUser = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const username = e.target[1].value;
    const password = e.target[2].value;
    const newsletter = e.target[3].checked;

    if (!isValidEmail(email)) {
      setError("Email is invalid");
      return;
    }

    if (!password || password.length < 3) {
      setError("Password is too short");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          username,
          password,
        }),
      });
      if (!response.ok) {
        response.json().then((e) => {
          setError(e.error);
        });
      }
      if (response.status === 200) {
        if (newsletter) {
          const newsletterRes = await fetch("/api/add-newsletter", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email }),
          });
          if (!newsletterRes.ok) {
            throw new Error("Failed to create newsletter");
          }
        }
        setError("");
        setUserForm(false);
        window.location.reload();
      }
    } catch (error: any) {
      setError(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (!initialFetchComplete) {
      fetchHandler();
      setInitialFetchComplete(true);
    }
  }, []);

  useEffect(() => {
    if (initialFetchComplete) {
      fetchHandler();
    }
  }, [page, initialFetchComplete]);

  return (
    <main className="flex h-[100dvh]">
      <div className="my-[25px] flex w-screen lg:h-auto flex-col short:justify-start lg:justify-center items-center">
        {showConfirm && (
          <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
            <div className="bg-secondTheme p-4 rounded-xl border-mainTheme border-2">
              <p>Are you sure you want to delete this user?</p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="bg-white px-4 py-2 mr-5 rounded text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={isSubmitting}
                  className="bg-mainTheme text-black px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {editConfirm && (
          <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
            <div className="bg-secondTheme p-4 rounded-xl border-mainTheme border-2">
              <p>Are you sure you want to change this users role?</p>
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setEditConfirm(false)}
                  className="bg-white px-4 py-2 mr-5 rounded text-black"
                >
                  Cancel
                </button>
                <button
                  onClick={handleEditUser}
                  disabled={isSubmitting}
                  className="bg-mainTheme text-black px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {userForm && (
          <div className="z-10 fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
            <div
              onClick={() => {
                setError("");
                setUserForm(false);
              }}
              className="absolute left-0 top-0 w-full h-full backdrop-blur-sm"
            ></div>
            <div className="absolute tCenter w-[95dvw] md:w-[70dvw] lg:w-[40dvw] h-[70vh] bg-secondTheme bg-opacity-90 rounded-3xl border-2 border-mainTheme">
              <XMarkIcon
                onClick={() => {
                  setError("");
                  setUserForm(false);
                }}
                className="w-10 absolute right-6 top-5 cursor-pointer hover:text-mainTheme transition-all"
              />
              <div className="flex justify-center h-[100%]">
                <form
                  onSubmit={handleAddUser}
                  className="w-[90%] xs:w-[50%] h-[100%] flex flex-col items-center justify-center"
                >
                  <h1 className="mb-20 text-xl md:text-2xl">Add new account</h1>
                  <input
                    type="text"
                    className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
                    placeholder="Email"
                    required
                  />
                  <input
                    type="text"
                    className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
                    placeholder="Username"
                    required
                  />
                  <input
                    type="password"
                    className="w-full border-0 bg-[#353535] placeholder:text-[#bebebe82] text-[#BEBEBE] rounded-full px-3 py-2 mb-5 focus:outline-none"
                    placeholder="Password"
                    required
                  />

                  <div className="flex w-full items-center ml-4 ">
                    <input
                      id="default-checkbox"
                      type="checkbox"
                      className="w-5 h-5 accent-mainTheme"
                    />

                    <label
                      htmlFor="default-checkbox"
                      className="ms-2 text-ms text-white select-none"
                    >
                      Newsletter
                    </label>
                  </div>

                  <p className="text-red-600 ">{error && error}</p>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className=" my-5 w-2/4 tracking-wider font-bold text-md bg-[#ea851998] text-white py-2 rounded-full hover:bg-[#ffa60040] transition"
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="w-[100%] short:w-[100%] lg:w-[90%] short:h-[auto] lg:h-[14%] flex justify-center short:justify-center lg:justify-start mb-[20px] short:mb-[20px] lg:mb-[0px]">
          <div className="flex flex-col items-center short:flex lg:block">
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-mainTheme">Manage user account</p>
          </div>
        </div>
        <div className="w-[90%] h-auto lg:h-[86%] flex flex-col items-end">
          <div className="flex justify-between w-full ">
            <div className="flex items-center mb-3 gap-1.5 xs:gap-3 select-none">
              <button
                onClick={handleRefreshUsers}
                disabled={isLoading}
                className=" text-white rounded-full hover:brightness-50 transition-all rotate"
              >
                <ArrowPathIcon className="w-8" />
              </button>
              <div>
                <input
                  id="search"
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className=" bg-[#161616] rounded-3xl px-5 p-1.5 mr-2 xs:mr-0 w-[180px] xs:w-[200px] text-white focus:outline-none focus:ring-0 border-2 focus:border-mainTheme placeholder:text-[#666]"
                />
              </div>
            </div>
            <div className="mb-3">
              <button
                onClick={() => setUserForm(true)}
                className="bg-white text-black p-2 rounded-full hover:brightness-50 transition-all"
              >
                <UserPlusIcon className="w-6" />
              </button>
            </div>
          </div>

          <div
            className="w-full h-full relative overflow-x-auto lg:overflow-x-hidden hideScrollbar"
            onScroll={handleScroll}
          >
            <table className="w-[100%]">
              <tbody className="trTable w-full">
                <tr className="bg-[#ffa60040] h-10 font-bold w-[100%] select-none">
                  <td className="min-w-[190px] lg:w-[30%] pl-10 rounded-s-3xl ">
                    <p
                      onClick={() => {
                        toggleSortOrder("username");
                      }}
                      className="w-[40px] cursor-pointer "
                    >
                      Username
                    </p>
                  </td>
                  <td className="min-w-[200px] lg:w-[30%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("email");
                      }}
                      className="w-[40px] cursor-pointer"
                    >
                      Email
                    </p>
                  </td>
                  <td className="min-w-[150px] lg:w-[20%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("createdAt");
                      }}
                      className="w-[80px] cursor-pointer "
                    >
                      Created At
                    </p>
                  </td>
                  <td className="min-w-[150px] lg:w-[15%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("role");
                      }}
                      className="w-[30px] cursor-pointer "
                    >
                      Role
                    </p>
                  </td>
                  <td className="min-w-[30px] lg:w-auto rounded-e-3xl">
                    <TrashIcon className="w-5 hidden" />
                  </td>
                </tr>
                {filterUsers(searchQuery).map((user, index) => (
                  <tr key={index} className="trTable h-10 rounded-3xl">
                    <td className="pl-10 rounded-s-3xl">{user.username}</td>
                    <td>{user.email}</td>
                    <td>
                      {new Date(user.createdAt).toLocaleDateString("en-GB", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      })}
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        {user.role}
                        <PencilSquareIcon
                          onClick={() => editUser(user._id)}
                          className="w-5 cursor-pointer select-none hover:text-mainTheme"
                        />
                      </div>
                    </td>
                    <td className="rounded-e-3xl">
                      <TrashIcon
                        onClick={() => deleteUser(user._id)}
                        className="w-5 cursor-pointer select-none hover:text-mainTheme"
                      />
                    </td>
                  </tr>
                ))}
                {!hasMore && (
                  <tr className="mb-4 py-4 hidden lg:table-row">
                    <td
                      colSpan={5}
                      className="text-center py-2 text-mainTheme border-t-2 border-mainTheme"
                    >
                      No more users to display
                    </td>
                  </tr>
                )}
                {isLoading && hasMore && (
                  <tr className="hidden lg:table-row">
                    <td colSpan={5} className="w-full h-full relative">
                      <div className="w-[50px] h-[50px] absolute left-[50%] top-3 -translate-x-1/2">
                        <LoadingSpinner />
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
        {!hasMore && (
          <div className="w-[90%] mb-4 py-4 lg:hidden">
            <div className="text-center py-2 text-mainTheme border-t-2 border-mainTheme">
              No more users to display
            </div>
          </div>
        )}
        {isLoading && hasMore && (
          <div className="lg:hidden">
            <div className="w-full h-full relative">
              <div className="w-[50px] h-[50px] absolute left-[50%] top-3 -translate-x-1/2">
                <LoadingSpinner />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
