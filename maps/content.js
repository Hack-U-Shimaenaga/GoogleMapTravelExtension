window.onload = function() {

  let currentJWT = "";
  let addresses = [];

  // 今のJWTを取得する
  async function getCurrentJWT() {
    const result = await chrome.storage.local.get(["jwt"]);
    const currentJWT = result.jwt;
    console.log("currentJWT");
    console.log(currentJWT);
    return currentJWT;
  }

  // 新しいJWTを取得する
  async function getNewJWT(usernamae, password) {
    const response = await fetch("https://msi15vtq54.execute-api.ap-northeast-1.amazonaws.com/dev_travel/get_jwt");
    const jwt = await response.text()
    console.log(jwt)
    chrome.storage.local.set({ jwt: jwt }, () => {
      console.log("JWT saved to storage");
    });
    return jwt;
  }

  // 今あるJWTを認証する
  async function authJWT(jwt) {
    const response = await fetch("https://msi15vtq54.execute-api.ap-northeast-1.amazonaws.com/dev_travel/auth_jwt", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + jwt
      }
    });

    const data = await response.json(); // 認証結果のユーザー情報など
    return data;
  }

  // 初期動作
  // もしJWTを保持してなかったら、新しくJWTを取得して、認証を元に、userの情報を取得
  async function init() {
    // 保存されている JWT を取得
    // let currentJWT = await getCurrentJWT(); // await 必須
    // console.log("currentJWT", currentJWT);

    // if (!currentJWT) {
    //   // JWT がなければ新規取得
    //   let username = "test_user";
    //   let password = "password";
    //   currentJWT = await getNewJWT(username, password);
    // }

    // // JWT を使って認証
    // const userData = await authJWT(currentJWT);

    // console.log("username");
    // console.log(userData.user);

    let result = await chrome.storage.local.get(["addresses"]);
    const addresses = result.addresses || [];
    result = await chrome.storage.local.get(["addressToNameDict"]);
    const addressToNameDict = result.addressToNameDict || [];
    console.log(addresses);
    console.log(addressToNameDict);
    if (addresses != null && addresses.length != 0) {
      await showNewAddress();
    }
  }

  init();

  // textを選択した時に住所追加できるようにする
  document.addEventListener('mouseup', (event) => {
    // 入力欄や編集可能領域内では何もしない
    if (event.target.tagName === 'INPUT' || 
        event.target.tagName === 'TEXTAREA' || 
        event.target.isContentEditable) {
      return;
    }

    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
      if (confirm(selectedText + ": この場所を追加しますか？")) {
        addAddressToList(selectedText);
        addAddressToNameDict(selectedText, selectedText);
        showNewAddress();
      }
    }
    
    window.getSelection().removeAllRanges();
    selectedText = "";
  });


  // iframe内のgoogle map htmlからの検索結果メッセージを受け取る
  window.addEventListener("message", async (event) => {
    const data = event.data;
    console.log(data)
    if (data.type === "geocodeError") {
      alert(data.placeName + ": 検索結果が出てきませんでした。住所または別の単語で検索してください。")
      await deleteFromAddressListAndDict(data.address);
    } else if (data.type === "markerDeleted") {
      const result = await chrome.storage.local.get(["addressToNameDict"]);
      const addressToNameDict = result.addressToNameDict || [];
      console.log(data.placeName);
      console.log(addressToNameDict[data.placeName] + "が削除されました")
      await deleteFromAddressListAndDict(data.address);
    }
  });

  // addressをlistから削除
  async function deleteFromAddressListAndDict(addressToRemove) {
    let result = await chrome.storage.local.get(["addresses"]);
    let addressList = result.addresses || [];
    console.log("addressList before delete")
    console.log(addressList)

    // 配列から該当アドレスを除外
    addressList = addressList.filter(addr => addr !== addressToRemove);

    // 更新した配列をlocalStorageに保存
    // localStorage.setItem("addresses", JSON.stringify(addressList));
    chrome.storage.local.set({ addresses: addressList }, () => {
      console.log("delete addresses saved to storage");
      console.log(addressList);
    });

    // 既存の辞書を取得（なければ空オブジェクト）
    result = await chrome.storage.local.get(["addressToNameDict"]);
    const addressToNameDict = result.addressToNameDict || [];

    // 例: addressを削除
    delete addressToNameDict[addressToRemove];

    // 保存
    chrome.storage.local.set({ addressToNameDict: addressToNameDict }, () => {
      console.log("delete addressToNameDict saved to storage");
      console.log(addressToNameDict);
    });
  }

  // 住所をハイライトして、クリックすると地図上に出るようにする
  function highlightAndBind(element) {
    // 住所パターン
    const addressPattern = /(東京都|北海道|京都府|大阪府|.{2,3}県)\s*([^\s\d]{1,10}[市区町村])\s*([^\d\s]{1,20})\s*([南東西北\d０-９一二三四五六七八九十条丁目番地号\-]+)?/g;


    if (element.nodeType === Node.TEXT_NODE) {
      const parent = element.parentNode;
      const text = element.textContent;
      const replacedHTML = text.replace(addressPattern, (match) => {
        return `<span class="address" style="background-color: #9E8F87; cursor:pointer;">${match}</span>`;
      });
      if (replacedHTML !== text) {
        const span = document.createElement('span');
        span.innerHTML = replacedHTML;
        if (parent != null) {
          parent.replaceChild(span, element);
        }

        // クリックイベント付与
        span.querySelectorAll('.address').forEach(addrElem => {
          addrElem.addEventListener('click', () => registerAddressWithName(addrElem.innerText.trim()));
        });
      }
    }
  }

  // 初回処理
  function scanAllTextNodes(node) {
    node.childNodes.forEach(child => {
      if (child.nodeType === Node.TEXT_NODE) {
        highlightAndBind(child);
      } else {
        scanAllTextNodes(child);
      }
    });
  }
  scanAllTextNodes(document.body);

  // MutationObserverセットアップ
  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      mutation.addedNodes.forEach(node => {
        if (node.nodeType === Node.TEXT_NODE) {
          highlightAndBind(node);
        } else if (node.nodeType === Node.ELEMENT_NODE) {
          scanAllTextNodes(node);
        }
      });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true });

  // 既存の地図に新しいアドレスを追加または新しい地図を表示
  function registerAddressWithName(address) {
    addAddressToList(address);
    const placeName = prompt("場所名を入力してください");

    if (placeName !== null) {  // キャンセルでなければ処理を続ける
      addAddressToNameDict(address, placeName);
      showNewAddress();
    }
  }

  async function addAddressToList(address) {
    // 既存の住所リストを取得（なければ空配列）
    const result = await chrome.storage.local.get(["addresses"]);
    const addressList = result.addresses || [];

    // 配列にaddressが含まれているかチェック
    if (!addressList.includes(address)) {
      // 新しい住所を追加
      addressList.push(address);

      // JSONに変換して保存
      chrome.storage.local.set({ addresses: addressList }, () => {
        console.log("add addresses saved to storage");
        console.log(addressList);
      });
    }
  }

  async function addAddressToNameDict(address, placeName) {
    // 既存の辞書を取得（なければ空オブジェクト）
    const result = await chrome.storage.local.get(["addressToNameDict"]);
    const addressToNameDict = result.addressToNameDict || [];

    // 例: placeNameをキーにして値をセット
    addressToNameDict[address] = placeName; // ここに対応する名前や情報を入れる

    // 保存
    chrome.storage.local.set({ addressToNameDict: addressToNameDict }, () => {
      console.log("add addressToNameDict saved to storage");
      console.log(addressToNameDict);
    });
  }

  async function showNewAddress() {
    console.log("showNewAddress");
    const existingMap = document.getElementById('mapContainer');
    console.log(existingMap)
    if (existingMap) {
      existingMap.remove();
    }

    const mapContainer = document.createElement('div');
    try {
      // コンテナ作成
      mapContainer.style.position = 'fixed';
      mapContainer.style.right = '0';
      mapContainer.style.top = '0';
      mapContainer.style.width = '350px';
      mapContainer.style.height = '300px';
      mapContainer.style.zIndex = '9999';
      mapContainer.style.border = '1px solid #ccc';
      mapContainer.style.boxShadow = '0 0 5px rgba(0,0,0,0.3)';
      mapContainer.style.resize = 'both'; // 引き伸ばし
      mapContainer.style.overflow = 'auto';
      mapContainer.id = 'mapContainer';

      makeResizableLeftBottom(mapContainer);

      // Map iframe作成
      const mapIframe = document.createElement('iframe');
      mapIframe.src = `https://msi15vtq54.execute-api.ap-northeast-1.amazonaws.com/dev_travel/map`;
      mapIframe.width = "100%";
      mapIframe.height = "100%";
      mapIframe.style.border = "0";

      // Login iframe作成
      const loginIframe = document.createElement('iframe');
      loginIframe.src = `https://msi15vtq54.execute-api.ap-northeast-1.amazonaws.com/dev_travel/show_login`;
      loginIframe.width = "100%";
      loginIframe.height = "100%";
      loginIframe.style.border = "0";

      // Register iframe作成
      const registerIframe = document.createElement('iframe');
      registerIframe.src = `https://msi15vtq54.execute-api.ap-northeast-1.amazonaws.com/dev_travel/show_register`;
      registerIframe.width = "100%";
      registerIframe.height = "100%";
      registerIframe.style.border = "0";


      // deleteボタン作成
      const deleteMapButton = document.createElement('button');
      deleteMapButton.textContent = "x";
      deleteMapButton.style.position = 'absolute';
      deleteMapButton.style.top = '5px';
      deleteMapButton.style.right = '5px';
      deleteMapButton.style.background = 'black';
      deleteMapButton.style.color = 'white';
      deleteMapButton.style.border = 'none';
      deleteMapButton.style.padding = '5px 10px';
      deleteMapButton.style.cursor = 'pointer';
      deleteMapButton.addEventListener('click', function() {
        mapContainer.remove();
        chrome.storage.local.set({ addresses: [] })
        chrome.storage.local.set({ addressToNameDict: {} })
      });

      // 縮小ボタン作成
      const shrinkMapButton = document.createElement('button');
      shrinkMapButton.textContent = "-";
      shrinkMapButton.style.position = 'absolute';
      shrinkMapButton.style.top = '5px';
      shrinkMapButton.style.right = '40px';
      shrinkMapButton.style.background = 'black';
      shrinkMapButton.style.color = 'white';
      shrinkMapButton.style.border = 'none';
      shrinkMapButton.style.padding = '5px 10px';
      shrinkMapButton.style.cursor = 'pointer';

      // しおり作るボタン
      const shioriButton = document.createElement('button');
      shioriButton.textContent = "しおりを作る";
      shioriButton.style.position = 'absolute';
      shioriButton.style.bottom = '0px';
      shioriButton.style.right = '0px';
      shioriButton.style.backgroundColor = "yellow";
      shioriButton.style.border = 'none';
      shioriButton.style.padding = '5px 10px';
      shioriButton.style.cursor = 'pointer';

      // 新規アカウント作るボタン
      const registerButton = document.createElement('button');
      registerButton.textContent = "新規アカウント作る";
      registerButton.style.position = 'absolute';
      registerButton.style.bottom = '0px';
      registerButton.style.right = '0px';
      registerButton.style.backgroundColor = "yellow";
      registerButton.style.border = 'none';
      registerButton.style.padding = '5px 10px';
      registerButton.style.cursor = 'pointer';
      registerButton.style.display = 'none';

      // 「地図の表示」ボタン作成（最初は非表示）
      const showMapIcon = document.createElement('img');

      showMapIcon.style.position = 'fixed';
      showMapIcon.style.top = '5px';
      showMapIcon.style.right = '20px';
      showMapIcon.style.width = '20px';
      showMapIcon.style.height = '20px';
      showMapIcon.style.background = 'white';
      showMapIcon.style.border = '1px solid black';
      showMapIcon.style.cursor = 'pointer';
      showMapIcon.style.display = 'none'; // 最初は非表示
      showMapIcon.src = 'https://img.icons8.com/ios-filled/50/000000/marker.png'
      showMapIcon.alt = "map";

      // 縮小ボタンクリック時の処理
      shrinkMapButton.addEventListener('click', function() {
        // mapContainerの地図表示部分を非表示にする（例として中身全体を非表示に）
        // ここはmapの中身がどこかによって変える必要あり
        // もしmapContainerが地図の親要素なら一旦非表示に
        mapContainer.style.display = 'none';

        // 「地図の表示」ボタンを表示
        showMapIcon.style.display = 'block';
      });

      // 「地図の表示」ボタンのクリックで元に戻す
      showMapIcon.addEventListener('click', function() {
        mapContainer.style.display = 'block';
        showMapIcon.style.display = 'none';
      });

      // しおりボタンクリック時の処理
      shioriButton.addEventListener('click', async function() {
        // mapIframe.style.display = "none";
        // shioriButton.style.display = "none";
        // registerButton.style.display = "block";

        const result = await chrome.storage.local.get(["addresses"]);
        const addressList = result.addresses || [];

        const query = encodeURIComponent(JSON.stringify(addressList));
        window.top.location.href = `http://localhost:3000?addresses=${query}`;

      });


      // 新規ボタンクリック時の処理
      registerButton.addEventListener('click', function() {
        mapIframe.style.display = "none";
        loginIframe.style.display = "none";
        registerIframe.style.display = "block";
        shioriButton.style.display = "none";
        registerButton.style.display = "none";
      });



      // コンテナに追加
      mapContainer.appendChild(mapIframe);
      mapContainer.appendChild(loginIframe);
      mapContainer.appendChild(registerIframe);
      mapContainer.appendChild(shrinkMapButton);
      mapContainer.appendChild(shioriButton);
      mapContainer.appendChild(registerButton);
      mapContainer.appendChild(deleteMapButton);
      document.body.appendChild(showMapIcon);
      document.body.appendChild(mapContainer);

      // iframe内のgoogle mapにaddressListを渡す
      mapIframe.onload = async () => {
        let result = await chrome.storage.local.get(["addresses"]);
        const addressList = result.addresses || [];
        result = await chrome.storage.local.get(["addressToNameDict"]);
        const addressToNameDict = result.addressToNameDict || [];
        console.log("addressList");
        console.log(addressList);
        console.log("addressToNameDict")
        console.log(addressToNameDict);
        mapIframe.contentWindow.postMessage({ addressList: addressList, addressToNameDict: addressToNameDict}, '*');
      };
    } catch (error) {
      console.error("Error loading map:", error);
      mapContainer.innerText = "Something went wrong."
    }
  }

  function makeResizableLeftBottom(element) {
    const handle = document.createElement('div');
    handle.style.position = 'absolute';
    handle.style.left = '0';
    handle.style.bottom = '0';
    handle.style.width = '30px';
    handle.style.height = '30px';
    handle.style.background = 'rgba(0,0,0,0.5)';
    handle.style.cursor = 'nwse-resize';
    handle.style.zIndex = '10000';

    element.style.position = 'fixed';  // 固定位置なのでOK
    element.appendChild(handle);

    let startX, startY, startWidth, startHeight;

    handle.addEventListener('mousedown', (e) => {
      e.preventDefault();
      startX = e.clientX;
      startY = e.clientY;
      startWidth = parseInt(document.defaultView.getComputedStyle(element).width, 10);
      startHeight = parseInt(document.defaultView.getComputedStyle(element).height, 10);

      function doDrag(e) {
        // 左下ドラッグなので、横は減少、縦は増加
        const dx = startX - e.clientX; // 横方向の増減（左にドラッグで幅アップ）
        const dy = e.clientY - startY; // 縦方向の増減（下にドラッグで高さアップ）

        element.style.width = (startWidth + dx) + 'px';
        element.style.height = (startHeight + dy) + 'px';
      }

      function stopDrag() {
        document.documentElement.removeEventListener('mousemove', doDrag, false);
        document.documentElement.removeEventListener('mouseup', stopDrag, false);
      }

      document.documentElement.addEventListener('mousemove', doDrag, false);
      document.documentElement.addEventListener('mouseup', stopDrag, false);
    });
  }

};