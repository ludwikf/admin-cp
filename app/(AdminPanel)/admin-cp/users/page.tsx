"use client";
import React, { useEffect, useState } from "react";
import { TrashIcon, ArrowPathIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { UserPlusIcon } from "@heroicons/react/24/outline";
import { signOut, useSession } from "next-auth/react";
import LoadingSpinner from "@/app/components/LoadingSpinner";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [userForm, setUserForm] = useState(false);
  const [error, setError] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const { data: session, status }: any = useSession();

  const fetchUsers = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error: any) {
      throw new Error(error);
    } finally {
      setIsLoading(false);
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
    if (sortBy === "createdAt") {
      return sortUsersByCreatedAt(filteredUsers);
    }
    return sortUsersByColumn(sortBy, filteredUsers);
  };

  const deleteUser = async (userId: any) => {
    setUserToDelete(userId);
    setShowConfirm(true);
  };
  const handleDeleteUser = async () => {
    try {
      const response = await fetch(`/api/delete-user?id=${userToDelete}`, {
        method: "DELETE",
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
    }
  };

  const handleRefreshUsers = async () => {
    fetchUsers();
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
        fetchUsers();
      }
    } catch (error: any) {
      setError(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);
  return (
    <main className="flex h-screen">
      <div className="my-[25px] flex w-screen flex-col justify-center items-center">
        {showConfirm && (
          <div className="z-10 absolute top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm">
            <div className="bg-secondTheme p-4 rounded">
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
                  className="bg-mainTheme text-black px-4 py-2 rounded"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
        {userForm && (
          <div className="z-10 ">
            <div
              onClick={() => {
                setError("");
                setUserForm(false);
              }}
              className="absolute left-0 top-0 w-full h-full backdrop-blur-sm"
            ></div>
            <div className="absolute tCenter w-[40vw] h-[70vh] bg-secondTheme bg-opacity-90 rounded-3xl border-2 border-mainTheme">
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
                  className="w-[50%] h-[100%] flex flex-col items-center justify-center"
                >
                  <h1 className="mb-20 text-3xl">Add new account</h1>
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
                    className=" my-5 w-2/4 tracking-wider font-bold text-md bg-[#ea851998] text-white py-2 rounded-full hover:bg-[#ffa60040] transition"
                  >
                    Create
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}
        <div className="w-[90%] h-[14%] flex">
          <div>
            <h1 className="text-3xl font-bold">Users</h1>
            <p className="text-mainTheme">Manage user accounts</p>
          </div>
        </div>
        <div className="w-[90%] h-[90%] flex flex-col items-end">
          <div className="flex justify-between w-full ">
            <div className="flex items-center mb-3 gap-3 select-none">
              <button
                onClick={handleRefreshUsers}
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
                  className=" bg-[#161616] rounded-3xl px-5 p-1.5 w-[200px] text-white focus:outline-none focus:ring-0 border-2 focus:border-mainTheme placeholder:text-[#666]"
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

          <div className="w-full h-full relative">
            {isLoading && (
              <div className="absolute -translate-x-1/2 left-1/2 top-[75px]">
                <div className="w-24 h-24">
                  <LoadingSpinner />
                </div>
              </div>
            )}
            <table className="w-[100%]">
              <tbody className="trTable">
                <tr className="bg-[#ffa60040] h-10 font-bold w-[100%] select-none">
                  <td className="w-[30%] pl-10 rounded-s-3xl ">
                    <p
                      onClick={() => {
                        toggleSortOrder("username");
                      }}
                      className="w-[40px] cursor-pointer "
                    >
                      Username
                    </p>
                  </td>
                  <td className="w-[30%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("email");
                      }}
                      className="w-[40px] cursor-pointer"
                    >
                      Email
                    </p>
                  </td>
                  <td className="w-[20%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("createdAt");
                      }}
                      className="w-[80px] cursor-pointer "
                    >
                      Created At
                    </p>
                  </td>
                  <td className="w-[15%] ">
                    <p
                      onClick={() => {
                        toggleSortOrder("role");
                      }}
                      className="w-[30px] cursor-pointer "
                    >
                      Role
                    </p>
                  </td>
                  <td className="rounded-e-3xl">
                    <TrashIcon className="w-5 hidden" />
                  </td>
                </tr>

                {isLoading
                  ? null
                  : filterUsers(searchQuery).map((user) => (
                      <tr key={user._id} className="trTable h-10 rounded-3xl">
                        <td className="pl-10 rounded-s-3xl">{user.username}</td>
                        <td>{user.email}</td>
                        <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                        <td>{user.role}</td>
                        <td className="rounded-e-3xl">
                          <TrashIcon
                            onClick={() => deleteUser(user._id)}
                            className="w-5 cursor-pointer select-none"
                          />
                        </td>
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
