import { authService, dbService } from "fbase";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

export default ({refreshUser, userObj}) => {
    const history = useHistory();
    const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
    const onLogOutClick = () => {
        authService.signOut();
        history.push("/");
    }    
    const getMyNweets = async() => {
        const nweets = await dbService
            .collection("nweets")
            .where("creatorId", "==", userObj.uid)
            .orderBy("createdAt","asc")
            .get();
    };

    useEffect(() => {
        getMyNweets();
    },[]);
    
    const onSubmit =async(event) => {
        event.preventDefault();
        if(userObj.displayName !== newDisplayName) {
            await userObj.updateProfile({
                displayName: newDisplayName
            })
            refreshUser();
        }
    }
    const onChange = (event) => {
        const {
            target : {value}
        } = event;
        setNewDisplayName(value);
    }
    return (
        <div className="container">
            <form onSubmit={onSubmit} className="profileForm">
                <input 
                    onChange={onChange}
                    type="text" 
                    autoFocus
                    placeholder="이름을 변경해주세요" 
                    value={newDisplayName}
                    className="formInput"
                    style={{
                        paddingTop : 7,
                        paddingBottom : 7
                    }}
                />
                <input 
                    type="submit" 
                    placeholder="Update Profile" 
                    className="formBtn"
                    style={{
                        marginTop: 10,
                    }}
                    value="Update"
                />
            </form>
            <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>
                Log Out
            </span>
        </div>
   
    );
};