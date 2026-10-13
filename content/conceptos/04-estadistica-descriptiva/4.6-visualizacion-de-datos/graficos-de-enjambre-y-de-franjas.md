---
id: graficos-de-enjambre-y-de-franjas
titulo: Gráficos de enjambre y de franjas
titulo_en: Beeswarm and strip plots
alias:
  - gráfico de franjas
  - strip plot
  - beeswarm
  - gráfico de puntos por grupo
modulo: 4
submodulo: '4.6'
orden: 19
nivel: basico
prerrequisitos:
  - diagrama-de-caja
relaciones:
  - tipo: relacionado
    id: diagrama-de-violin
etiquetas:
  - visualización
  - todos los datos
  - comparación de grupos
  - sobreposición de puntos
resumen: >
  Los gráficos de franjas y de enjambre dibujan cada observación como un punto sobre un eje común, una
  fila por grupo. El de franjas puede desplazar los puntos al azar; el de enjambre los acomoda para que
  ninguno se encime.
formula: '\text{punto } i = (x_i,\ g_i + \delta_i),\qquad \delta_i \text{ elegido para no encimar}'
visualizacion:
  componente: ChartGallery
  parametros:
    grafico: enjambre
    grupos:
      - nombre: Placebo
        forma: normal
        centro: 138
        escala: 9
        n: 60
        decimales: 0
      - nombre: Fármaco
        forma: mezcla
        parametro: 3
        centro: 128
        escala: 8
        n: 60
        decimales: 0
    eje:
      variable: Presión sistólica
      unidad: mmHg
    modo: enjambre
referencias:
  - clave: tufte
  - clave: mcelreath
publicado: true
---

## Intuición

Un ensayo clínico mide la presión sistólica de 60 pacientes con placebo y 60 con un fármaco. Un diagrama de caja resume cada grupo en cinco números, pero oculta cuántos pacientes hay y cómo se reparten: dos grupos con cajas idénticas pueden tener formas muy distintas. Con solo 120 datos se puede hacer algo mejor: dibujarlos todos.

En un **gráfico de franjas** cada paciente es un punto sobre el eje de presión, en la fila de su grupo. Como las presiones se registran en milímetros enteros, muchos pacientes comparten valor y sus puntos se enciman. Hay dos remedios. Desplazar cada punto verticalmente al azar (franjas con desplazamiento aleatorio) separa la mayoría de ellos. El **gráfico de enjambre** va más allá: acomoda los puntos uno por uno, subiendo o bajando cada uno lo justo para no tocar a los anteriores, de modo que la silueta del enjambre dibuja la forma de la distribución sin ocultar ningún dato.

## Definición

:::definicion[Gráfico de franjas]
Para observaciones $x_i$ con grupo $g_i \in \{1, \dots, G\}$, el **gráfico de franjas** dibuja el punto $i$ en $(x_i, g_i)$. En la versión con desplazamiento aleatorio se dibuja en $(x_i, g_i + \delta_i)$ con $\delta_i$ uniforme en $[-a, a]$.
:::

:::definicion[Gráfico de enjambre]
El **gráfico de enjambre** dibuja el punto $i$ en $(x_i, g_i + \delta_i)$, donde los desplazamientos $\delta_i$ se eligen en orden, del menor al mayor $x_i$, como el valor más cercano a cero tal que el círculo de radio $\rho$ centrado en el punto no se superponga con ninguno de los ya colocados:

$$
(x_i - x_j)^2 + (\delta_i - \delta_j)^2 \ge (2\rho)^2 \quad \text{para todo } j \text{ ya colocado del mismo grupo},
$$

con las coordenadas medidas en pantalla.
:::

El desplazamiento vertical no tiene significado: solo separa los puntos. La posición horizontal es la única que codifica el dato.

:::nota[Qué significa cada símbolo]
- $x_i$: valor de la observación $i$; $g_i$: grupo al que pertenece; $G$: número de grupos.
- $\delta_i$: desplazamiento vertical del punto $i$ dentro de su fila.
- $a$: amplitud máxima del desplazamiento aleatorio.
- $\rho$: radio de cada punto en pantalla.
:::

## Cómo usar la visualización

Los puntos se agregan por tandas y una línea vertical marca la mediana de cada grupo, que también se lee en el encabezado.

El selector **Acomodo de los puntos** cambia entre franjas sin desplazamiento, franjas con desplazamiento aleatorio y enjambre sin encimar puntos.

Experimentos sugeridos:

1. Elegir franjas sin desplazamiento: los pacientes con la misma presión quedan en un solo punto y parece haber muchos menos datos.
2. Elegir el enjambre: el grupo con fármaco muestra dos acumulaciones, algo que un diagrama de caja no revelaría.
3. Comparar las medianas del encabezado: la del fármaco es unos 10 mmHg menor.

## Ejemplo

Siete estudiantes obtuvieron estas calificaciones: 7, 8, 8, 8, 9, 6 y 8.

1. En franjas sin desplazamiento quedan cuatro puntos visibles: 6, 7, 8 y 9. El 8 aparece una vez aunque lo obtuvieron cuatro estudiantes.
2. En el enjambre, el primer 8 se coloca en la línea central, el segundo arriba, el tercero abajo y el cuarto más arriba: una columna de cuatro puntos.
3. La altura de la columna en 8 muestra de inmediato que es la calificación más frecuente, la moda.

:::figura[Las siete calificaciones del ejemplo en franjas sin desplazamiento; al cambiar a enjambre aparece la columna de cuatro puntos en 8.]{componente="ChartGallery"}
```yaml
grafico: enjambre
grupos:
  - nombre: Calificaciones
    valores: [7, 8, 8, 8, 9, 6, 8]
eje:
  variable: Calificación
modo: franjas
```
:::

## Propiedades

- **Todos los datos a la vista:** se ven el tamaño de cada grupo, los atípicos, los huecos y las acumulaciones.
- **La silueta del enjambre aproxima la densidad:** es más ancho donde hay más datos, como un violín hecho de puntos.
- **Adecuado para muestras pequeñas o medianas:** desde unas decenas hasta unos cientos de puntos por grupo.

:::figura[Bimodalidad visible: tiempos de 80 corredores en una carrera de 10 km con aficionados y atletas federados. El enjambre muestra dos acumulaciones separadas.]{componente="ChartGallery"}
```yaml
grafico: enjambre
grupos:
  - nombre: Corredores
    forma: mezcla
    parametro: 4
    centro: 52
    escala: 4
    n: 80
eje:
  variable: Tiempo de carrera
  unidad: min
modo: enjambre
```
:::

## Errores comunes

- **Leer la posición vertical como una variable.** En ambos gráficos el desplazamiento vertical solo separa puntos.
- **Usar franjas sin desplazamiento con valores repetidos.** Se pierde la cuenta de cuántas observaciones hay en cada valor.
- **Dibujar un enjambre con miles de puntos.** El enjambre se desborda de su fila; con muchos datos conviene un violín o un histograma.

:::figura[Demasiados puntos para un enjambre: 600 tiempos de espera en una fila. Los puntos ya no caben en su franja y quedan aplastados contra los bordes.]{componente="ChartGallery"}
```yaml
grafico: enjambre
grupos:
  - nombre: Espera
    forma: sesgo-derecha
    centro: 8
    escala: 3
    n: 600
    decimales: 0
eje:
  variable: Tiempo de espera
  unidad: min
modo: enjambre
```
:::

## Conexiones

El gráfico de enjambre muestra los datos que el [[diagrama-de-caja]] resume y dibuja con puntos la silueta que el [[diagrama-de-violin]] estima con una densidad. Resuelve, en una dimensión, el mismo problema de sobreposición que el [[grafico-hexbin]] resuelve en dos. Con muchos grupos ordenados, el [[grafico-ridgeline]] es una alternativa más compacta.

## Formulario

:::formula[Posición en franjas con desplazamiento aleatorio]
$$
(x_i,\ g_i + \delta_i),\qquad \delta_i \sim \text{Uniforme}(-a, a)
$$

- $x_i$: valor de la observación; $g_i$: fila de su grupo.
- $\delta_i$: desplazamiento vertical aleatorio; $a$: su amplitud máxima.
:::

:::formula[Condición de no superposición del enjambre]
$$
(x_i - x_j)^2 + (\delta_i - \delta_j)^2 \ge (2\rho)^2
$$

- $x_i$, $x_j$: posiciones horizontales en pantalla de dos puntos del mismo grupo.
- $\delta_i$, $\delta_j$: sus desplazamientos verticales.
- $\rho$: radio de cada punto.
:::
