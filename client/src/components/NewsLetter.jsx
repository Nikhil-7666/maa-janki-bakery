const NewsLetter=()=>{
  return (
 <div className="flex flex-col items-center justify-center text-center space-y-2">
            <h1 className="md:text-4xl text-2xl font-semibold">Never Miss a Deal!</h1>
    <br/>
            <form className="flex items-center justify-between max-w-2xl w-full md:h-13 h-12">
                <input
                    className="border border-gray-300 rounded-md h-full border-r-0 outline-none w-full rounded-r-none px-3 text-gray-500"
                    type="text"
                    placeholder="...chatbox integration in next sem"
                    required
                />
                <button type="submit" className="md:px-12 px-8 h-full text-white bg-indigo-500 hover:bg-indigo-600 transition-all cursor-pointer rounded-md rounded-l-none">
                    Chatbox
                </button>
            </form>
        </div>
 );

};

export default NewsLetter;