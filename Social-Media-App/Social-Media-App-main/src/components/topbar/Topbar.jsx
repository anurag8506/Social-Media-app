import "./topbar.css"
import {Search,Person, Chat, Notifications } from "@mui/icons-material"
export default function Topbar() {
  return (
    <div className="topbarContainer">
        <div className="topbarLeft">
          <span className="logo">SkyRocket</span>
        </div>
        <div className="topbarCenter">
          <div className="searchbar">
       <Search  className="searchIcon"/>
       <input placeholder="Search for friends, post or video" className="searchInput" />
          </div>
        </div>
        <div className="topbarRight">
         <div className="tobarLinks">
          <span className="topbarLinks">Homepage</span>
          <span className="topbarLinks">Timeline</span>
         </div>
         <div className="topbarIcons">
          <div className="topbarIconItem">
            <Person/>
            <span className="topbarIconBadge">1</span>
          </div>
          <div className="topbarIconItem">
            <Chat/>
            <span className="topbarIconBadge">2</span>
          </div>
          <div className="topbarIconItem">
            <Notifications/>
            <span className="topbarIconBadge">1</span>
          </div>
         </div>
         <img src="/assets/person/1.jpeg" alt="" className="topbarImg" />
        </div>
    </div>
  )
}
