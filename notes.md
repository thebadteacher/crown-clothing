1.  Important = setState is async
    componentDidMount() {
    this.unsubscribeFromAuth = auth.onAuthStateChanged(async (userAuth) => {
    if (userAuth) {
    const userRef = await createUserProfileDocument(userAuth);

        			/*
        			The snapShot itself won't give me any data except id
        			But .data() won't give id, hence we use both to construct the state
        			*/
        			userRef.onSnapshot((snapShot) => {
        				this.setState(
        					{
        						currentUser: {
        							id: snapShot.id,
        							...snapShot.data(),
        						},
        					},
        					/*
        					setState is asyncronous
        					Here we have to pass the clg to a cb funct, otherwise setState migh not have finished propagating
        					setState({operation}, () =>{checkOperation})
        					*/
        					() => {
        						console.log(this.state);
        					}
        				);
        			});
        		} else {
        			this.setState({ currentUser: userAuth });
        		}
        	});
        }
