    import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

    /* ==========================
       DATOS DE REGALOS
    ========================== */
    const regalos = [
      {
        foto: '/img/1.png',
        miniTexto: 'Feliz cumple ✨',
        mensajeCompleto: 'Que este nuevo año de vida esté lleno de aventuras increíbles, momentos especiales y todo lo que tu corazón desee. ¡Eres increíble!',
        autor: 'Mari'
      },
      {
        foto: '/img/2.png',
        miniTexto: 'Un regalo especial 🎁',
        mensajeCompleto: 'Gracias por ser una persona tan maravillosa. Espero que este día sea tan especial como tú lo eres para todos nosotros.',
        autor: 'Juan'
      },
      {
        foto: '/img/3.jpg',
        miniTexto: 'Para ti 💙',
        mensajeCompleto: 'Que cada momento de este nuevo año te traiga alegría, éxito y mucho amor. ¡Feliz cumpleaños!',
        autor: 'Ana'
      },
      {
        foto: 'https://via.placeholder.com/400x400/87ceeb/ffffff?text=Foto+4',
        miniTexto: 'Recuerdos únicos 🌟',
        mensajeCompleto: 'Los mejores momentos están por venir. Que este año sea el inicio de algo extraordinario en tu vida.',
        autor: 'Carlos'
      },
      {
        foto: 'https://via.placeholder.com/400x400/4a9eff/ffffff?text=Foto+5',
        miniTexto: 'Momentos especiales ⭐',
        mensajeCompleto: 'Gracias por cada risa compartida y cada momento inolvidable. Que sigas brillando siempre.',
        autor: 'Laura'
      },
      {
        foto: 'https://via.placeholder.com/400x400/87ceeb/ffffff?text=Foto+6',
        miniTexto: 'Siempre recordado 💫',
        mensajeCompleto: 'Eres una persona única y especial. Que este cumpleaños sea el mejor de todos. ¡Te lo mereces!',
        autor: 'Pedro'
      }
    ];

    /* ==========================
       ESTADOS
    ========================== */
    const STATES = {
      INTRO: "intro",
      ENTRADA: "entrada",
      EXPLORACION: "exploracion",
    };

    let currentState = STATES.INTRO;
    let modalOpen = false;

    /* ==========================
       CONFIG
    ========================== */
    const CONFIG = {
      galaxy: {
        count: 500000,
        radius: 7,
        branches: 10,
        spin: 0.30,
        size: 0.015,
        insideColor: "#ffffff",
        middleColor: "#87ceeb",
        outsideColor: "#4a9eff",
        randomness: 1.0,
        randomnessPower: 10000000,
        verticalSpread: 5.0,
      },
      text: {
        canvasWidth: 2048,
        canvasHeight: 512,
        fontSize: 100,
        scale: 4,
        floatAmplitude: 0.08,
        floatSpeed: 0.0008,
      },
      photos: {
        scale: 1.5,
        floatAmplitude: 0.06,
        floatSpeed: 0.0007,
      },
      particles: {
        count: 250,
        size: 0.05,
      }
    };

    /* ==========================
       ESCENA
    ========================== */
    const canvas = document.getElementById("galaxy");
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x000000, 8, 30);

    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.z = 12;

    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ReinhardToneMapping;
    renderer.toneMappingExposure = 1.2;

    /* ==========================
       RAYCASTER PARA CLICKS
    ========================== */
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    /* ==========================
       LUCES DINÁMICAS
    ========================== */
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);

    const pointLight1 = new THREE.PointLight(0x4a9eff, 2.5, 25);
    pointLight1.position.set(5, 5, 5);
    scene.add(pointLight1);

    const pointLight2 = new THREE.PointLight(0x87ceeb, 2.5, 25);
    pointLight2.position.set(-5, -5, -5);
    scene.add(pointLight2);

    const pointLight3 = new THREE.PointLight(0x6eb5ff, 2, 20);
    pointLight3.position.set(0, 8, 0);
    scene.add(pointLight3);

    /* ==========================
       AGUJERO NEGRO CON GLOW ROJO DIFUMINADO
    ========================== */
    function crearAgujeroNegro() {
      const group = new THREE.Group();
      
      const geometry = new THREE.SphereGeometry(0.6, 64, 64);
      const material = new THREE.MeshBasicMaterial({
        color: 0x000000,
      });
      const blackHole = new THREE.Mesh(geometry, material);
      group.add(blackHole);
      
      const glowLayers = [];
      const layerCount = 8;
      
      for (let i = 0; i < layerCount; i++) {
        const t = i / (layerCount - 1);
        const radius = 0.7 + t * 1.5;
        const opacity = 0.6 * (1 - t * 0.85);
        
        const glowGeometry = new THREE.SphereGeometry(radius, 32, 32);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0xff0000,
          transparent: true,
          opacity: opacity,
          blending: THREE.AdditiveBlending,
          side: THREE.BackSide,
          depthWrite: false,
        });
        const glowSphere = new THREE.Mesh(glowGeometry, glowMaterial);
        glowLayers.push(glowSphere);
        group.add(glowSphere);
      }
      
      const redLight = new THREE.PointLight(0xff0000, 5, 8);
      redLight.position.set(0, 0, 0);
      group.add(redLight);
      
      scene.add(group);
      return { group, glowLayers, light: redLight };
    }

    const blackHole = crearAgujeroNegro();
    blackHole.group.visible = false;

    /* ==========================
       PARTÍCULAS DE ESTRELLAS FLOTANTES
    ========================== */
    function createStarShape() {
      const shape = new THREE.Shape();
      const outerRadius = 0.5;
      const innerRadius = 0.2;
      const points = 5;
      
      for (let i = 0; i < points * 2; i++) {
        const radius = i % 2 === 0 ? outerRadius : innerRadius;
        const angle = (i * Math.PI) / points;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        if (i === 0) {
          shape.moveTo(x, y);
        } else {
          shape.lineTo(x, y);
        }
      }
      shape.closePath();
      return shape;
    }

    const starParticles = [];
    function createFloatingStarParticles() {
      const starShape = createStarShape();
      const extrudeSettings = { depth: 0.05, bevelEnabled: false };
      const geometry = new THREE.ExtrudeGeometry(starShape, extrudeSettings);
      
      for (let i = 0; i < 12; i++) {
        const material = new THREE.MeshPhongMaterial({
          color: Math.random() > 0.5 ? 0x4a9eff : 0x87ceeb,
          transparent: true,
          opacity: 0.8,
          emissive: 0x4a9eff,
          emissiveIntensity: 0.5,
        });
        
        const star = new THREE.Mesh(geometry, material);
        star.scale.set(0.12, 0.12, 0.12);
        
        const angle = Math.random() * Math.PI * 2;
        const radius = 8 + Math.random() * 5;
        star.position.set(
          Math.cos(angle) * radius,
          -5 + Math.random() * 2,
          Math.sin(angle) * radius
        );
        
        star.userData = {
          baseY: star.position.y,
          speed: 0.01 + Math.random() * 0.02,
          angle: angle,
          radius: radius,
          rotSpeed: (Math.random() - 0.5) * 0.02
        };
        
        starParticles.push(star);
        scene.add(star);
      }
    }

    createFloatingStarParticles();

    /* ==========================
       PARTÍCULAS BRILLANTES (GLITTER)
    ========================== */
    const glitterParticles = new THREE.Group();
    const glitterGeometry = new THREE.BufferGeometry();
    const glitterPositions = new Float32Array(CONFIG.particles.count * 3);
    const glitterColors = new Float32Array(CONFIG.particles.count * 3);

    for (let i = 0; i < CONFIG.particles.count; i++) {
      const i3 = i * 3;
      const angle = Math.random() * Math.PI * 2;
      const radius = 5 + Math.random() * 10;
      
      glitterPositions[i3] = Math.cos(angle) * radius;
      glitterPositions[i3 + 1] = (Math.random() - 0.5) * 15;
      glitterPositions[i3 + 2] = Math.sin(angle) * radius;
      
      const color = new THREE.Color();
      color.setHSL(0.55 + Math.random() * 0.1, 0.8, 0.7);
      glitterColors[i3] = color.r;
      glitterColors[i3 + 1] = color.g;
      glitterColors[i3 + 2] = color.b;
    }

    glitterGeometry.setAttribute('position', new THREE.BufferAttribute(glitterPositions, 3));
    glitterGeometry.setAttribute('color', new THREE.BufferAttribute(glitterColors, 3));

    const glitterMaterial = new THREE.PointsMaterial({
      size: CONFIG.particles.size,
      vertexColors: true,
      transparent: true,
      opacity: 0.9,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const glitter = new THREE.Points(glitterGeometry, glitterMaterial);
    glitterParticles.add(glitter);
    scene.add(glitterParticles);

    /* ==========================
       GALAXIA CON BRAZOS DEFINIDOS
    ========================== */
    function crearGalaxia() {
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(CONFIG.galaxy.count * 3);
      const colors = new Float32Array(CONFIG.galaxy.count * 3);

      const inside = new THREE.Color(CONFIG.galaxy.insideColor);
      const middle = new THREE.Color(CONFIG.galaxy.middleColor);
      const outside = new THREE.Color(CONFIG.galaxy.outsideColor);

      for (let i = 0; i < CONFIG.galaxy.count; i++) {
        const i3 = i * 3;
        
        const r = 0.8 + Math.pow(Math.random(), 1.5) * (CONFIG.galaxy.radius - 0.8);
        const branchAngle = ((i % CONFIG.galaxy.branches) / CONFIG.galaxy.branches) * Math.PI * 2;
        const spinAngle = r * CONFIG.galaxy.spin;
        
        const branchX = Math.cos(branchAngle + spinAngle) * r;
        const branchZ = Math.sin(branchAngle + spinAngle) * r;
        
        const isOnArm = Math.random() < 0.8;
        const powerFactor = isOnArm ? 12 : 4;
        const spread = CONFIG.galaxy.randomness * r * 0.25;
        
        const randomX = Math.pow(Math.random(), powerFactor) * 
                        (Math.random() < 0.5 ? 1 : -1) * spread;
        const randomY = Math.pow(Math.random(), powerFactor) * 
                        (Math.random() < 0.5 ? 1 : -1) * spread * 0.3;
        const randomZ = Math.pow(Math.random(), powerFactor) * 
                        (Math.random() < 0.5 ? 1 : -1) * spread;

        positions[i3] = branchX + randomX;
        positions[i3 + 1] = randomY;
        positions[i3 + 2] = branchZ + randomZ;

        const normalizedRadius = (r - 0.8) / (CONFIG.galaxy.radius - 0.8);
        let mixedColor;
        
        if (normalizedRadius < 0.3) {
          mixedColor = inside.clone().lerp(middle, normalizedRadius / 0.3);
        } else {
          mixedColor = middle.clone().lerp(outside, (normalizedRadius - 0.3) / 0.7);
        }
        
        colors[i3] = mixedColor.r;
        colors[i3 + 1] = mixedColor.g;
        colors[i3 + 2] = mixedColor.b;
      }

      geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: CONFIG.galaxy.size,
        sizeAttenuation: true,
        vertexColors: true,
        transparent: true,
        opacity: 0,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });

      const points = new THREE.Points(geometry, material);
      scene.add(points);
      return points;
    }

    const galaxy = crearGalaxia();

    /* ==========================
       TEXTOS SIN FONDO - ALTA RESOLUCIÓN
    ========================== */
    const textos = [];

    function crearTexto(mensaje, index) {
      const c = document.createElement("canvas");
      c.width = CONFIG.text.canvasWidth;
      c.height = CONFIG.text.canvasHeight;

      const ctx = c.getContext("2d");
      
      ctx.shadowColor = '#87ceeb';
      ctx.shadowBlur = 40;
      
      ctx.fillStyle = '#ffffff';
      ctx.font = `bold ${CONFIG.text.fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      for (let i = 0; i < 3; i++) {
        ctx.fillText(mensaje, c.width / 2, c.height / 2);
      }

      const texture = new THREE.CanvasTexture(c);
      texture.minFilter = THREE.LinearFilter;
      texture.magFilter = THREE.LinearFilter;
      texture.anisotropy = renderer.capabilities.getMaxAnisotropy();

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({ 
          map: texture, 
          transparent: true,
          depthTest: true,
          depthWrite: false
        })
      );

      sprite.scale.set(CONFIG.text.scale, CONFIG.text.scale * 0.5, 1);

      const angle = Math.random() * Math.PI * 2;
      const radius = 2.5 + Math.random() * 2.5;
      const baseY = (Math.random() - 0.5) * 3;

      sprite.userData = { 
        angle, 
        radius, 
        baseY,
        index: index,
        isText: true
      };

      sprite.position.set(
        Math.cos(angle) * radius,
        baseY,
        Math.sin(angle) * radius
      );

      sprite.visible = false;
      textos.push(sprite);
      scene.add(sprite);
    }

    regalos.forEach((regalo, idx) => crearTexto(regalo.miniTexto, idx));

    /* ==========================
       FOTOS TRANSPARENTES CLICKEABLES
    ========================== */
    const spritesFotos = [];
    const loader = new THREE.TextureLoader();

    regalos.forEach((regalo, idx) => {
      loader.load(
        regalo.foto, 
        (texture) => {
          const sprite = new THREE.Sprite(
            new THREE.SpriteMaterial({ 
              map: texture, 
              transparent: true,
              alphaTest: 0.1
            })
          );

          const angle = (idx / regalos.length) * Math.PI * 2 + Math.random() * 0.5;
          const radius = 4 + Math.random() * 2;
          const baseY = (Math.random() - 0.5) * 2;

          sprite.userData = { 
            angle, 
            radius, 
            baseY,
            index: idx,
            isPhoto: true,
            regalo: regalo
          };
          
          sprite.scale.set(CONFIG.photos.scale, CONFIG.photos.scale, 1);

          sprite.position.set(
            Math.cos(angle) * radius,
            baseY,
            Math.sin(angle) * radius
          );

          sprite.visible = false;
          spritesFotos.push(sprite);
          scene.add(sprite);
        }
      );
    });

    /* ==========================
       INTRO ESTILO CRASH BANDICOOT 2
    ========================== */
    function crearTextoIntro(texto, esPequeno = false) {
      const c = document.createElement("canvas");
      c.width = 2560;
      c.height = 640;

      const ctx = c.getContext("2d");
      
      ctx.shadowColor = '#87ceeb';
      ctx.shadowBlur = 50;
      ctx.fillStyle = '#ffffff';
      
      const fontSize = esPequeno ? 80 : 200;
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(texto, c.width / 2, c.height / 2);

      const sprite = new THREE.Sprite(
        new THREE.SpriteMaterial({
          map: new THREE.CanvasTexture(c),
          transparent: true,
          opacity: 0,
        })
      );

      const baseScale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
      const scaleMultiplier = esPequeno ? 0.8 : 1;
      
      sprite.scale.set(
        8 * baseScale * scaleMultiplier, 
        1.6 * baseScale * scaleMultiplier, 
        1
      );
      sprite.position.set(0, 0, 2);
      scene.add(sprite);
      return sprite;
    }

    const introTexts = [
      { text: "Sony Computer Entertainment presents", small: false },
      { text: "A Universal Interactive Studios Production", small: false },
    ];
    let introIndex = 0;
    let introStart = Date.now();
    let introSprite = crearTextoIntro(introTexts[introIndex].text, introTexts[introIndex].small);

    let entradaStart = 0;

    setTimeout(() => {
      document.getElementById('loading').style.display = 'none';
    }, 500);

    /* ==========================
       FUNCIONES DE MODAL
    ========================== */
    window.openModal = function(regalo) {
      modalOpen = true;
      canvas.classList.add('blurred');
      
      document.getElementById('modalPhoto').src = regalo.foto;
      document.getElementById('modalTitle').textContent = regalo.miniTexto;
      document.getElementById('modalMessage').textContent = regalo.mensajeCompleto;
      document.getElementById('modalAuthor').textContent = '— ' + regalo.autor;
      
      const modal = document.getElementById('photoModal');
      modal.classList.add('active');
    };

    window.closeModal = function() {
      modalOpen = false;
      canvas.classList.remove('blurred');
      
      const modal = document.getElementById('photoModal');
      modal.classList.remove('active');
    };

    /* ==========================
       INPUT MOUSE / TOUCH
    ========================== */
    let lastX = null;
    let lastY = null;
    let deltaX = 0;
    let deltaY = 0;
    let isDragging = false;

    function updateInput(x, y) {
      if (currentState !== STATES.EXPLORACION) return;
      if (lastX === null) {
        lastX = x;
        lastY = y;
        return;
      }
      deltaX = (x - lastX) * 0.003;
      deltaY = (y - lastY) * 0.003;
      lastX = x;
      lastY = y;
    }

    function onCanvasClick(event) {
      if (currentState !== STATES.EXPLORACION || modalOpen) return;

      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(spritesFotos);

      if (intersects.length > 0) {
        const clickedSprite = intersects[0].object;
        if (clickedSprite.userData.isPhoto) {
          window.openModal(clickedSprite.userData.regalo);
        }
      }
    }

    canvas.addEventListener("mousedown", (e) => {
      isDragging = true;
      lastX = null;
      lastY = null;
    });

    canvas.addEventListener("mousemove", (e) => {
      if (isDragging) {
        updateInput(e.clientX, e.clientY);
      }
    });

    canvas.addEventListener("mouseup", (e) => {
      if (!isDragging || (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01)) {
        onCanvasClick(e);
      }
      isDragging = false;
      lastX = null;
      lastY = null;
    });

    canvas.addEventListener("mouseleave", () => {
      isDragging = false;
      lastX = null;
      lastY = null;
    });

    canvas.addEventListener("touchstart", (e) => {
      isDragging = true;
      if (e.touches.length) {
        lastX = e.touches[0].clientX;
        lastY = e.touches[0].clientY;
      }
    });

    canvas.addEventListener("touchmove", (e) => {
      e.preventDefault();
      if (e.touches.length && isDragging) {
        updateInput(e.touches[0].clientX, e.touches[0].clientY);
      }
    });

    canvas.addEventListener("touchend", (e) => {
      if (!isDragging || (Math.abs(deltaX) < 0.01 && Math.abs(deltaY) < 0.01)) {
        if (e.changedTouches.length) {
          const touch = e.changedTouches[0];
          onCanvasClick({ clientX: touch.clientX, clientY: touch.clientY });
        }
      }
      isDragging = false;
      lastX = null;
      lastY = null;
    });

    /* ==========================
       ANIMACIÓN
    ========================== */
    let orbit = 0;
    const clock = new THREE.Clock();

    function animate() {
      requestAnimationFrame(animate);
      const now = Date.now();
      const elapsedTime = clock.getElapsedTime();

      /* INTRO ESTILO CRASH */
      if (currentState === STATES.INTRO) {
        const t = now - introStart;

        if (t < 1200) {
          introSprite.material.opacity = t / 1200;
        } else if (t < 3000) {
          introSprite.material.opacity = 1;
        } else if (t < 4000) {
          introSprite.material.opacity = 1 - (t - 3000) / 1000;
        } else {
          scene.remove(introSprite);
          introIndex++;
          if (introIndex < introTexts.length) {
            introSprite = crearTextoIntro(introTexts[introIndex].text, introTexts[introIndex].small);
            introStart = now;
          } else {
            currentState = STATES.ENTRADA;
            entradaStart = now;
          }
        }

        renderer.render(scene, camera);
        return;
      }

      /* ENTRADA */
      if (currentState === STATES.ENTRADA) {
        const p = Math.min((now - entradaStart) / 3000, 1);
        galaxy.material.opacity = p * 0.95;
        const eased = 1 - Math.pow(1 - p, 3);
        camera.position.z = 12 - eased * 4;

        if (p > 0.3) {
          blackHole.group.visible = true;
          const blackHoleOpacity = Math.min((p - 0.3) / 0.7, 1);
          blackHole.glowLayers.forEach((layer, i) => {
            const t = i / (blackHole.glowLayers.length - 1);
            const baseOpacity = 0.6 * (1 - t * 0.85);
            layer.material.opacity = baseOpacity * blackHoleOpacity;
          });
        }

        if (p === 1) {
          textos.forEach((t) => (t.visible = true));
          spritesFotos.forEach((f) => (f.visible = true));
          currentState = STATES.EXPLORACION;
        }
      }

      /* EXPLORACIÓN */
      if (currentState === STATES.EXPLORACION) {
        if (!isDragging && Math.abs(deltaX) < 0.0001 && Math.abs(deltaY) < 0.0001) {
          orbit += 0.0003;
        } else {
          orbit += deltaX;
        }

        deltaX *= 0.92;
        deltaY *= 0.92;

        galaxy.rotation.y = -orbit * 0.3;
        galaxy.rotation.x = Math.sin(orbit * 0.15) * 0.08;
        
        blackHole.group.rotation.y = elapsedTime * 0.3;
        blackHole.group.rotation.x = Math.sin(elapsedTime * 0.2) * 0.1;
        
        const pulse = Math.sin(elapsedTime * 2) * 0.5 + 0.5;
        blackHole.light.intensity = 4 + pulse * 3;
        
        blackHole.glowLayers.forEach((layer, i) => {
          const t = i / (blackHole.glowLayers.length - 1);
          const baseOpacity = 0.6 * (1 - t * 0.85);
          layer.material.opacity = baseOpacity * (0.7 + pulse * 0.3);
        });

        camera.position.x = Math.sin(orbit) * 8;
        camera.position.z = Math.cos(orbit) * 8;
        camera.position.y = THREE.MathUtils.clamp(
          camera.position.y + deltaY * 1.5,
          -3,
          3
        );

        pointLight1.position.x = Math.sin(elapsedTime * 0.5) * 5;
        pointLight1.position.z = Math.cos(elapsedTime * 0.5) * 5;
        pointLight2.position.x = Math.sin(elapsedTime * 0.3 + Math.PI) * 5;
        pointLight2.position.z = Math.cos(elapsedTime * 0.3 + Math.PI) * 5;
        pointLight3.position.y = 8 + Math.sin(elapsedTime * 0.4) * 2;

        starParticles.forEach((star, i) => {
          star.position.y += star.userData.speed;
          if (star.position.y > 10) {
            star.position.y = -5;
          }
          
          const angle = star.userData.angle + elapsedTime * 0.1;
          star.position.x = Math.cos(angle) * star.userData.radius;
          star.position.z = Math.sin(angle) * star.userData.radius;
          
          star.rotation.y += star.userData.rotSpeed;
          star.rotation.z = Math.sin(elapsedTime + i) * 0.1;
        });

        glitterParticles.rotation.y = elapsedTime * 0.05;
        const positions = glitter.geometry.attributes.position.array;
        for (let i = 0; i < CONFIG.particles.count; i++) {
          const i3 = i * 3;
          positions[i3 + 1] += Math.sin(elapsedTime * 2 + i) * 0.01;
        }
        glitter.geometry.attributes.position.needsUpdate = true;

        textos.forEach((t, i) => {
          const a = t.userData.angle + orbit * 0.8;
          t.position.x = Math.cos(a) * t.userData.radius;
          t.position.z = Math.sin(a) * t.userData.radius;
          t.position.y =
            t.userData.baseY +
            Math.sin(now * CONFIG.text.floatSpeed + i * 0.5) *
              CONFIG.text.floatAmplitude;
          
          t.lookAt(camera.position);
        });

        spritesFotos.forEach((s, i) => {
          const a = s.userData.angle + orbit * 0.5;
          s.position.x = Math.cos(a) * s.userData.radius;
          s.position.z = Math.sin(a) * s.userData.radius;
          s.position.y =
            s.userData.baseY +
            Math.sin(now * CONFIG.photos.floatSpeed + i * 0.7) *
              CONFIG.photos.floatAmplitude;
          
          s.lookAt(camera.position);
        });

        galaxy.rotation.y += 0.00015;
      }

      camera.lookAt(0, 0, 0);
      renderer.render(scene, camera);
    }

    animate();

    /* ==========================
       RESIZE
    ========================== */
    window.addEventListener("resize", () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    });