window.onload= function(){
	
    /**
     * Función cargarDatosEjesXeY
     * Esta funcion, se encarga de generar el arr del cual se nutre la gracica, en combinacion de arrX e arrY
     */
    function cargarDatosEjesXeY(arrY, arrX){
        let datos = [];
        
        for (i = 0; i < arrX.length; i++) {
            datos.push({x: arrX[i], y: arrY[i]});
        }
        console.log(datos);
        return datos;
    }

    /**
     * Funcion cargarGrafica
     * Esta funcion, se encarga de renderizar la grafica en el canvas con los valores obtenidos de los arr X e Y proporcionados
     */
    function cargarGrafica(){
        // Inicializamos la Grafica
        grafica = new Chart(document.getElementById("myChart"), {
            type: 'scatter',
            data: {
                datasets: [{
                        label: "Cigarrillos vs Esperanza de vida",
                        data: datosGrafica,
                        borderColor: "red",
                    }]
            },
            options: {
                responsive: false  
            }
        });
    }


    /**
     * Manejador calcularRLS
     * Manejador asincrono encargado de realizar la preccion sobre el algoritmo de regresion
     */
     async function calcularRLS(e){

        // Visualizamos un cartel calculando para informar al usuario
        document.getElementById("valy").innerHTML = "Calculando"
        document.getElementById("icon-refresh-valy").classList.remove("oculto");

        //Definimos el modelo que sera de regresion lineal
        const model = tf.sequential();
        
        //Agregamos una capa densa porque todos los nodos estan conectado entre si
        model.add(tf.layers.dense({units: 1, inputShape: [1]}));

        // Compilamos el modelo con un sistema de perdida de cuadratico y optimizamos con sdg
        model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
        
        // Creamos los tensores para x y para y
        const xs = tf.tensor2d(valX, [11, 1]); //Nº de elementos del arr x e y
        const ys = tf.tensor2d(valY, [11, 1]);

        // Obtenemos el valor de x
        let nuevoValX = Number(document.getElementById("inputNumCigarros").value);

        // Entrenamos el modelo 3000 veces, con la finalidad de obtener una prediccion mas cercana
        await model.fit(xs, ys, {epochs: 3000});
        
        // Obtenemos el valor de Y cuando el valor de x sea el introducido por el usuario
        let prediccionY = model.predict(tf.tensor2d([nuevoValX], [1, 1])).dataSync()[0];
        
        // Ocultamos el icono de espera
        document.getElementById("icon-refresh-valy").classList.add("oculto");

        // Escribimos el valor estimado de y
        document.getElementById("valy").innerText = prediccionY.toFixed(2) + " años";
        
        
        // Dibujamos en la grafica el nuevo valor de X y Y
        datosGrafica.push({x:nuevoValX,y:prediccionY});
        grafica.data.datasets[0].data = datosGrafica;
        grafica.update();
    }





    // Flujo del programa

    // **** Definicion de variables ***
    
    let grafica;
    let pSalida = document.getElementById("valy");

    // Definimos los parametros en x y en y
    let valY = [85.1  , 84.1  , 83 , 81.7 , 79  , 77.1, 74.9, 72.2, 69.6, 67.5, 64.3];   // Años
    let valX = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];                                       // Cigarrillos
    let datosGrafica;

    // Cargamos los datos de los arrays valY y valX en el arr datosGrafica
    datosGrafica = cargarDatosEjesXeY(valY,valX);

    // Iniciamos la grafica con los valores cargados en el arr datosGrafica
    cargarGrafica();

    // Captura del btn de calculo y llamada al manejador
    document.getElementById("btnCalcular").onclick = calcularRLS;
}