// Element du DOM
// Logo
const logo = document.querySelector('.logo');
// Information et portfolio de l'utilisateur
const allInfo = document.querySelector('.info-user');
const nameInfo = allInfo.querySelector('h1');
const cityInfo = document.querySelector('.info-city');
const bioInfo = document.querySelector('.info-bio');
const imgInfo = document.querySelector('.photo-img');
const list = allInfo.querySelector('ul');
const showWork = document.querySelector('.photo');
// Contact
const contactBtn = document.getElementById('contact');
const overlay = document.querySelector('.overlay-modal');
const modal = document.querySelector('.modal');
const closeBtn = document.querySelector('.fa-times');
const submitBtn = document.getElementById('submit');
const userContact = document.querySelector('.user-contact');
// Input du formulaire
const prenom = document.getElementById('prenom');
const nom = document.getElementById('nom');
const email = document.getElementById('email');
const message = document.getElementById('message');
const allForm = document.querySelectorAll('.form');
// Ordre de triage
const option = document.querySelector('.dropdown-content');
// Slider
const sliderContainer = document.querySelector('.slider-container');
const rightArrow = document.querySelector('.fa-angle-right');
const leftArrow = document.querySelector('.fa-angle-left');
const videoPlayer = document.querySelector('.video-player');

class User {
  constructor() {
    this.getUrl();
  }

  async getUrl() {
    try {
      const request = await fetch('../data/data.json');
      if (!request.ok) throw new Error('La requête ne fonctionne pas');

      const response = await request.json();
      const { photographers, media } = response;

      // eslint-disable-next-line no-restricted-globals
      logo.href = `${location.origin}/BilalEzzaaraoui_6_06102021`;

      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');

      const user = await this.getUser(photographers, id);
      this.updateInfo(user);
      const imgPortofolio = await this.mediaFilter(media, user);
      this.sortPhotographers(imgPortofolio, user);
      this.updatePortofolio(imgPortofolio, user);
      this.counterLikes(imgPortofolio);
      this.updateLikes(imgPortofolio);
    } catch (err) {
      console.log(err.message);
    }
  }

  getUser(data, index) {
    const user = data.find((item) => {
      if (item.id == index) return item;
    });
    return user;
  }

  updateInfo(data) {
    nameInfo.textContent = data.name;
    cityInfo.textContent = `${data.city}, ${data.country}`;
    bioInfo.textContent = data.tagline;
    imgInfo.src = `../img/Photographers ID Photos/${data.portrait}`;
    imgInfo.alt = `${data.name}`;

    let html = '';
    data.tags.forEach((element) => {
      html += `<li tabindex="0"><span>#${element}</span></li>
        `;
    });
    list.innerHTML = html;
    this.contact(data);
  }

  mediaFilter(data, user) {
    const media = data.filter((element) => {
      if (element.photographerId == user.id) return element;
    });
    return media;
  }

  updatePortofolio(data, user) {
    const salary = document.querySelector('.price-counter');
    salary.textContent = `${user.price}€ / jour`;
    let name = user.name.split(' ')[0];
    if (name.includes('-')) {
      name = name.replace('-', ' ');
    }

    let portofolio = '';
    data.forEach((item) => {
      if (item.image == undefined) {
        portofolio += `<article class="card" aria-label="Projet ${item.title}" >
          <a class="card-link">
            <div class="card-img">
            <video controls="controls" src="../img/Sample Photos /${name}/${item.video}" tabindex="0" role="video" class="work"></video>
            </div>
            <div class="card-footer" aria-label="${item.title}, closeup view">
              <p class="line" tabindex="0">${item.title}</p>
              <div class="card-footer-likes" aria-label="likes" tabindex="0">
                <p>${item.likes}</p>
                <em class="far fa-heart fa-coeur"></em>
              </div>
            </div>
          </a>
        </article>`;
      } else {
        portofolio += `<article class="card" aria-label="Projet ${item.title}">
          <a class="card-link" >
            <div class="card-img" aria-label="${item.title}, closeup view">
              <img src="../img/Sample Photos /${name}/${item.image}" alt="Photographie ${item.title}" tabindex="0" class="work"/>
            </div>
            <div class="card-footer">
              <p class="line" tabindex="0">${item.title}</p>
              <div class="card-footer-likes" aria-label="likes" tabindex="0">
                <p>${item.likes}</p>
                <em class="far fa-heart fa-coeur"></em>
              </div>
            </div>
          </a>
        </article>`;
      }
    });
    showWork.innerHTML = portofolio;
    this.slider(data, user);
  }

  counterLikes(data) {
    const section = document.querySelector('.photo');
    const likesBtn = section.querySelectorAll('.fa-heart');

    likesBtn.forEach((el) => {
      el.addEventListener('click', (e) => {
        // Titre de la carte
        const card = e.target.closest('.card');
        const cardTitle = card.querySelector('.line').textContent;

        // Objet correspondant au titre
        const dataCard = data.find((item) => {
          if (item.title === cardTitle) {
            return item;
          }
        });

        // Nombre de likes dans le dom
        const textLikes = e.target.parentElement.querySelector('p');
        const heartIcon = e.target;

        let numberLike = dataCard.likes;
        const targetLike = dataCard.likes;

        if (Number(textLikes.textContent) === targetLike) {
          // eslint-disable-next-line no-plusplus
          textLikes.textContent = ++numberLike;
          heartIcon.classList.replace('far', 'fas');
        } else if (Number(textLikes.textContent) !== dataCard.likes) {
          textLikes.textContent = numberLike;
          heartIcon.classList.replace('fas', 'far');
        }

        const divLikes = Array.from(document.querySelectorAll('.fa-coeur'));

        const totalLikes = divLikes.filter((el) => {
          if (el.classList.contains('fas')) {
            return el;
          }
        });
        this.updateLikes(data, totalLikes.length);
      });
    });
  }

  updateLikes(data, target) {
    const likeCounter = document.querySelector('.like-counter');

    const likesMap = data.map((item) => item.likes);

    const getTotal = (total, num) => total + num;

    const total = likesMap.reduce(getTotal, 0);

    likeCounter.innerHTML = `${
      total + target ? total + target : total
    } <i class="fas fa-heart"></i>`;
  }

  contact(user) {
    contactBtn.addEventListener('click', () => {
      overlay.style.display = 'flex';
      if (overlay.style.display === 'flex') {
        prenom.focus();
        userContact.textContent = user.name;
        const emailIsValid = function (emailData) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailData);
        };

        closeBtn.addEventListener('click', () => {
          overlay.style.display = 'none';
        });

        document.addEventListener('keyup', (e) => {
          if (e.key === 'Escape') {
            overlay.style.display = 'none';
          }
        });

        submitBtn.addEventListener('click', (e) => {
          e.preventDefault();
          const setError = function (paramater1) {
            paramater1.classList.add('error');
          };

          const deleteError = function (paramater2) {
            return paramater2.classList.remove('error');
          };
          if (prenom.value === '') {
            setError(prenom);
          } else {
            deleteError(prenom);
          }

          if (nom.value === '') {
            setError(nom);
          } else {
            deleteError(nom);
          }

          if (email.value === '' || !emailIsValid(email.value)) {
            setError(email);
          } else {
            deleteError(email);
          }

          if (message.value === '') {
            setError(message);
          } else {
            deleteError(message);
          }

          let validation;
          allForm.forEach((item) => {
            if (item.classList.contains('error')) {
              validation = false;
            } else {
              validation = true;
            }
          });

          if (validation) {
            allForm.forEach((item) => console.log(item.value));
          }
        });
      }
    });
  }

  sortPhotographers(data, user) {
    option.addEventListener('change', (e) => {
      const result = option.options[option.selectedIndex].value;

      if (result === 'popularité') {
        const popularity = function (a, b) {
          // eslint-disable-next-line radix
          return parseInt(b.likes) - parseInt(a.likes);
        };
        this.updatePortofolio(data.sort(popularity), user);
      }

      if (result === 'date') {
        const date = function (a, b) {
          return new Date(b.date).valueOf() - new Date(a.date).valueOf();
        };

        this.updatePortofolio(data.sort(date), user);
      }

      if (result === 'titre') {
        const titre = function (a, b) {
          if (a.title > b.title) {
            return 1;
            // eslint-disable-next-line no-else-return
          } else if (b.title > a.title) {
            return -1;
          } else {
            return 0;
          }
        };
        this.updatePortofolio(data.sort(titre), user);
      }
    });
  }

  slider(data, user) {
    const allWork = document.querySelectorAll('.card');
    const work = document.querySelectorAll('.work');

    let name = user.name.split(' ')[0];
    if (name.includes('-')) {
      name = name.replace('-', ' ');
    }

    const checkVideo = function (dataObj, username) {
      if (dataObj.video !== undefined) {
        videoPlayer.style.display = 'flex';
        videoPlayer.src = `../img/Sample Photos /${username}/${dataObj.video}`;
        sliderContainer.querySelector('h2').textContent = dataObj.title;
      } else {
        videoPlayer.style.display = 'none';
      }

      if (dataObj.image !== undefined) {
        sliderContainer.querySelector('img').style.display = 'flex';
        sliderContainer.querySelector(
          'img'
        ).src = `../img/Sample Photos /${username}/${dataObj.image}`;
        sliderContainer.querySelector('h2').textContent = dataObj.title;
        sliderContainer.querySelector('img').alt = dataObj.title;
      } else {
        sliderContainer.querySelector('img').style.display = 'none';
      }
    };

    allWork.forEach((item) => {
      item.addEventListener('click', (e) => {
        e.preventDefault();

        let [source] = e.target.src.split('/').slice(-1);

        if (source.includes('%20')) {
          source = source.replace('%20', ' ');
        }

        data.find((obj) => {
          if (obj.image === source || obj.video === source) {
            sliderContainer.style.display = 'flex';
            checkVideo(obj, name);

            document
              .querySelector('.fa-croix')
              .addEventListener('click', () => {
                sliderContainer.style.display = 'none';
              });

            document.addEventListener('keyup', (e) => {
              if (e.key === 'Escape') {
                sliderContainer.style.display = 'none';
              }
            });

            let index = data.indexOf(obj);

            const rightClick = function () {
              // eslint-disable-next-line no-plusplus
              index++;
              if (index >= data.length) {
                index = 0;
              }
              checkVideo(data[index], name);
            };

            const leftClick = function () {
              if (index <= 0) {
                index = data.length;
              }
              // eslint-disable-next-line no-plusplus
              index--;
              checkVideo(data[index], name);
            };

            rightArrow.addEventListener('click', rightClick);
            leftArrow.addEventListener('click', leftClick);

            // eslint-disable-next-line no-inner-declarations
            function checkKey(e) {
              if (e.key == 'ArrowLeft') {
                leftClick();
              } else if (e.key == 'ArrowRight') {
                rightClick();
              }
            }
            document.onkeydown = checkKey;
          }
        });
      });
    });

    work.forEach((el) => {
      el.addEventListener('focus', (e) => {
        let [source] = e.target.src.split('/').slice(-1);

        if (source.includes('%20')) {
          source = source.replace('%20', ' ');
        }

        el.addEventListener('keyup', (e) => {
          if (e.keyCode === 13) {
            data.find((obj) => {
              if (obj.image === source || obj.video === source) {
                sliderContainer.style.display = 'flex';
                checkVideo(obj, name);

                document
                  .querySelector('.fa-croix')
                  .addEventListener('click', () => {
                    sliderContainer.style.display = 'none';
                  });

                document.addEventListener('keyup', (e) => {
                  if (e.key === 'Escape') {
                    sliderContainer.style.display = 'none';
                  }
                });

                let index = data.indexOf(obj);

                const rightClick = function () {
                  // eslint-disable-next-line no-plusplus
                  index++;
                  if (index >= data.length) {
                    index = 0;
                  }
                  checkVideo(data[index], name);
                };

                const leftClick = function () {
                  if (index <= 0) {
                    index = data.length;
                  }
                  // eslint-disable-next-line no-plusplus
                  index--;
                  checkVideo(data[index], name);
                };

                rightArrow.addEventListener('click', rightClick);
                leftArrow.addEventListener('click', leftClick);

                // eslint-disable-next-line no-inner-declarations
                function checkKey(e) {
                  if (e.key == 'ArrowLeft') {
                    leftClick();
                  } else if (e.key == 'ArrowRight') {
                    rightClick();
                  }
                }
                document.onkeydown = checkKey;
              }
            });
          }
        });
      });
    });
  }
}

const user = new User();
