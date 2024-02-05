import "./rightbar.css"
import {Users} from "../../dummyData"
import Online from "../online/Online"
import Home from "../../pages/home/Home";

export default function Rightbar({profile}) {
  const HomeRightbar =  () => {
    return(
      <>
       <div className="birthdayContainer">
          <img className="birthdayImg" src="assets/gift.png" alt="" />
          <span className="birthdayText">
            <b>Aman Gupta</b> and <b>2 other friends</b> have their birhday today.
          </span>
        </div>
        <img className="rightbarAd" src="assets/ad.png" alt="" />
        <h4 className="rightbarTitle">Online Friends</h4>
        <ul className="rightbarFriendList">
          {Users.map((u) => (
            <Online key={u.id} user={u} />
          ))}
        </ul>
      </>
    );
  };
  const ProfileRightbar =() =>{
    return(
      <>
      <h4 className="rightbarTitle">User Information</h4>
      <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightnbarInfoKey">City:</span>
          <span className="rightnbarInfoValue">Gorakhpur</span>
        </div>
        </div>

        <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightnbarInfoKey">From:</span>
          <span className="rightnbarInfoValue">India</span>
        </div> </div>
        <div className="rightbarInfo">
        <div className="rightbarInfoItem">
          <span className="rightnbarInfoKey">Relationship:</span>
          <span className="rightnbarInfoValue">Single</span>
        </div>
      </div>
      <h4 className="rightbarTitle">User Friends</h4>
      <div className="rightbarFollowings">
        <div className="rightbarFollowing">
         <img src="assets/person/1.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>
        <div className="rightbarFollowing">
         <img src="assets/person/1.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>
        <div className="rightbarFollowing">
         <img src="assets/person/2.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>
        <div className="rightbarFollowing">
         <img src="assets/person/3.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>
        <div className="rightbarFollowing">
         <img src="assets/person/4.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>
        <div className="rightbarFollowing">
         <img src="assets/person/5.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>
        <div className="rightbarFollowing">
         <img src="assets/person/6.jpeg" alt="" className="rightbarFollowingImg" />
         <span className="rightbarFollowingName">Virat</span>
        </div>

      </div>
      </>
    )
  }
  return (
    <div className="rightbar">
        <div className="rightbarWrapper">
        {profile ? <ProfileRightbar/> : <HomeRightbar/>}
           
        </div>
        </div>
  )
}
