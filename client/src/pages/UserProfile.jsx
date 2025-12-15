import { useContext, useState } from "react";
import { AppContext } from "../AppContext";
import toast from "react-hot-toast";
import BackButton from "../components/BackButton";

const UserProfile = () => {
  const { user, setUser, axios } = useContext(AppContext);
  const [preview, setPreview] = useState(user?.avatar || "");
  const [file, setFile] = useState(null);

  const handleFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please choose an image");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("avatar", file);
      const { data } = await axios.post("/api/user/avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (data.success) {
        toast.success("Profile photo updated");
        setUser((prev) => ({ ...(prev || {}), ...data.user }));
      } else {
        toast.error(data.message || "Upload failed");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  if (!user) {
    return (
      <div className="mt-12 px-4">
        <p className="text-lg">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="mt-4 px-4 md:px-0 max-w-3xl mx-auto pb-16">
      <BackButton />
      <h1 className="text-2xl md:text-3xl font-semibold mb-6 mt-8">Your Profile</h1>
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <div className="w-24 h-24 rounded-full bg-gray-100 overflow-hidden border border-gray-200">
            {preview ? (
              <img
                src={preview}
                alt="avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm text-gray-500">
                No photo
              </div>
            )}
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-semibold text-lg">{user.name}</p>
            <p className="text-gray-600 text-sm">{user.email}</p>
            <label className="text-indigo-600 text-sm cursor-pointer">
              Choose photo
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFile}
              />
            </label>
          </div>
        </div>

        <button
          onClick={handleUpload}
          className="self-start px-5 py-2 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default UserProfile;




