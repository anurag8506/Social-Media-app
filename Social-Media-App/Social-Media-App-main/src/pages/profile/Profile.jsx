import "./profile.css";
import Topbar from "../../components/topbar/Topbar";
import Sidebar from "../../components/sidebar/Sidebar";
import Feed from "../../components/feed/Feed";
import Rightbar from "../../components/rightbar/Rightbar";

export default function Profile() {
    return (
        <>
            <Topbar />
            <div className="Profile">
                <Sidebar />
                <div className="profileRight">
                    <div className="profileRightTop">
                        <div className="profileCover">
                        <img className="profileCoverImg" src="assets/post/3.jpeg" alt="" /> 
                        <img className="profileUserImg" src="assets/person/7.jpeg" alt="" /></div> 
                        <div className="profileInfo">
                            <h4 className="profieInfoName">Yogesh Tripathi</h4>
                            <span className="profieDesc">Hello, I am Yogesh Tripathi</span>
                            </div> 
                            </div>
                    <div className="profileRightBottom">
                        <Feed />
                        <Rightbar   profile/> </div>


                </div>

            </div>
            
        </>
    );
}
