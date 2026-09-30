---
id: independencia-lineal
titulo: Independencia lineal
titulo_en: Linear independence
alias:
  - vectores linealmente independientes
  - dependencia lineal
modulo: 0
submodulo: '0.3'
orden: 4
nivel: basico
prerrequisitos:
  - combinacion-lineal-y-espacio-generado
etiquetas:
  - independencia lineal
  - dependencia
  - redundancia
  - colinealidad
resumen: >
  Unos vectores son linealmente independientes cuando ninguno es combinación de los demás, o sea,
  cuando la única combinación que da el vector cero es la que tiene todos sus coeficientes nulos.
formula: 'c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k = \mathbf{0} \ \Rightarrow\ c_1 = \dots = c_k = 0'
visualizacion:
  componente: Space3D
  parametros:
    modo: generado
    conjuntos:
      - nombre: Tres independientes
        vectores: [[2, 0, 0], [0, 2, 0], [1, 1, 2]]
      - nombre: Tres en un mismo plano
        vectores: [[2, 0, 1], [0, 2, 1], [2, 2, 2]]
      - nombre: Dos paralelos
        vectores: [[1, 1, 1], [-2, -2, -2]]
      - nombre: Dos independientes
        vectores: [[2, 0, 1], [0, 2, 1]]
referencias:
  - clave: strang
  - clave: goodfellow
    capitulo: '2'
publicado: true
---

## Intuición

Un conjunto de vectores es independiente cuando cada uno aporta una dirección que los demás no pueden producir. En una encuesta con las variables "estatura en centímetros" y "estatura en metros", la segunda no agrega información: es la primera dividida entre cien. En un portafolio, un fondo que es exactamente la mitad de un fondo A más la mitad de un fondo B tampoco agrega una fuente de riesgo nueva.

Geométricamente, dos vectores del espacio son dependientes si están sobre una misma recta, y tres son dependientes si están en un mismo plano que pasa por el origen: el tercero se puede alcanzar combinando los otros dos. Otra forma de verlo es que existe una forma de combinarlos, con pesos no todos nulos, que regresa exactamente al origen, como un viaje de varios tramos que termina donde empezó. Cuando eso es imposible, los vectores son independientes y cada punto de su espacio generado se escribe de una única manera.

## Definición

:::definicion[Independencia lineal]
Los vectores $\mathbf{v}_1, \dots, \mathbf{v}_k$ son **linealmente independientes** si
$$
c_1\mathbf{v}_1 + \dots + c_k\mathbf{v}_k = \mathbf{0} \quad\Longrightarrow\quad c_1 = c_2 = \dots = c_k = 0.
$$
Si existe una combinación igual a $\mathbf{0}$ con algún $c_i \neq 0$, los vectores son **linealmente dependientes**.
:::

Equivalentemente, son dependientes si y solo si alguno de ellos es combinación lineal de los demás: si $c_j \neq 0$, se despeja $\mathbf{v}_j = -\tfrac{1}{c_j}\sum_{i \neq j} c_i\mathbf{v}_i$.

:::nota[Qué significa cada símbolo]
- $\mathbf{v}_1, \dots, \mathbf{v}_k$: vectores de un espacio vectorial.
- $c_i$: coeficientes reales de la combinación.
- $\mathbf{0}$: vector cero.
- $k$: número de vectores.
- $\Longrightarrow$: "implica"; la única forma de obtener cero es con todos los coeficientes nulos.
:::

## Cómo usar la visualización

La escena muestra hasta tres vectores del espacio y lo que generan: una recta, un plano sombreado o todo el espacio. El selector cambia de conjunto; la escena gira al arrastrarla, con los controles de ángulo o con la reproducción. El panel indica el rango, si los vectores son independientes y, con tres vectores, el determinante.

Con "Tres en un mismo plano" el tercer vector cae dentro del plano de los otros dos y el determinante es 0. Girar la escena hasta ver el plano de canto confirma que las tres flechas quedan sobre una sola línea en pantalla. Con "Tres independientes", ningún giro logra alinearlas.

## Ejemplo

Se estudian $\mathbf{v}_1 = (2, 0, 1)$, $\mathbf{v}_2 = (0, 2, 1)$ y $\mathbf{v}_3 = (2, 2, 2)$, perfiles de consumo de agua, luz y gas de tres hogares.

1. Se busca $c_1, c_2, c_3$ con $c_1\mathbf{v}_1 + c_2\mathbf{v}_2 + c_3\mathbf{v}_3 = \mathbf{0}$: $2c_1 + 2c_3 = 0$, $2c_2 + 2c_3 = 0$, $c_1 + c_2 + 2c_3 = 0$.
2. De las dos primeras, $c_1 = -c_3$ y $c_2 = -c_3$. La tercera da $-c_3 - c_3 + 2c_3 = 0$, que se cumple para todo $c_3$.
3. Con $c_3 = 1$: $-\mathbf{v}_1 - \mathbf{v}_2 + \mathbf{v}_3 = \mathbf{0}$, así que $\mathbf{v}_3 = \mathbf{v}_1 + \mathbf{v}_2$ y los vectores son dependientes.
4. El determinante de la matriz con esas columnas es $2(2\cdot 2 - 2\cdot 1) - 0 + 2(0\cdot 1 - 2\cdot 1) = 4 - 4 = 0$, lo que confirma la dependencia.

:::figura[Los tres perfiles del ejemplo. El tercero es la suma de los otros dos y queda dentro del plano que generan; al quitarlo, los dos restantes son independientes.]{componente="Space3D"}
```yaml
modo: generado
conjuntos:
  - nombre: Los tres perfiles
    vectores: [[2, 0, 1], [0, 2, 1], [2, 2, 2]]
  - nombre: Sin el tercero
    vectores: [[2, 0, 1], [0, 2, 1]]
```
:::

## Propiedades

- **Dos vectores:** son dependientes si y solo si uno es múltiplo del otro.
- **El cero arruina la independencia:** cualquier conjunto que contenga a $\mathbf{0}$ es dependiente, porque $1\cdot\mathbf{0} = \mathbf{0}$.
- **Demasiados vectores:** en $\mathbb{R}^n$, más de $n$ vectores siempre son dependientes.
- **Prueba con determinante:** $n$ vectores de $\mathbb{R}^n$ son independientes si y solo si el determinante de la matriz que forman como columnas es distinto de cero.
- **Coordenadas únicas:** si los vectores son independientes, cada vector de su espacio generado tiene una sola escritura como combinación de ellos.
- **Subconjuntos:** todo subconjunto de un conjunto independiente es independiente.

:::figura[Caso de dos vectores dependientes en el plano: (1, 2) y (-2, -4) están sobre la misma recta, y sus combinaciones con coeficientes enteros nunca salen de ella.]{componente="VectorPlane"}
```yaml
modo: combinacion
v1: [1, 2]
v2: [-2, -4]
coeficientes: [1, 0.5]
```
:::

:::demostracion
Coordenadas únicas: si $\sum a_i\mathbf{v}_i = \sum b_i\mathbf{v}_i$, restando queda $\sum (a_i - b_i)\mathbf{v}_i = \mathbf{0}$. Por independencia, cada $a_i - b_i = 0$.
:::

## Errores comunes

- **Revisar solo pares de vectores.** Tres vectores pueden ser independientes dos a dos y aun así dependientes en conjunto, como en el ejemplo.
- **Confundir independencia lineal con independencia estadística.** La primera trata de vectores fijos; la segunda, de variables aleatorias. Variables no correlacionadas no son lo mismo que vectores independientes.
- **Concluir dependencia porque un coeficiente sale cero.** Lo que importa es si existe una solución no trivial, no el valor de un coeficiente en particular.
- **Ignorar la dependencia en datos.** En regresión, columnas dependientes (colinealidad perfecta) hacen que los coeficientes no estén definidos de manera única.

## Conexiones

La independencia se define con la [[combinacion-lineal-y-espacio-generado|combinación lineal]]. Un conjunto independiente que genera el espacio es una [[base-y-dimension|base]], y el número máximo de columnas independientes de una matriz es su [[rango-de-una-matriz|rango]]. El [[determinante-como-factor-de-volumen|determinante]] es cero exactamente cuando las columnas son dependientes. En aprendizaje automático, la dependencia entre características produce multicolinealidad.

## Formulario

:::formula[Definición de independencia]
$$
\sum_{i=1}^{k} c_i\mathbf{v}_i = \mathbf{0} \ \Longrightarrow\ c_1 = \dots = c_k = 0
$$

- $\mathbf{v}_i$: vectores del conjunto.
- $c_i$: coeficientes reales.
- $k$: número de vectores.
:::

:::formula[Dependencia como redundancia]
$$
c_j \neq 0 \ \Rightarrow\ \mathbf{v}_j = -\frac{1}{c_j}\sum_{i \neq j} c_i\mathbf{v}_i
$$

- $c_j$: coeficiente no nulo de una combinación igual a cero.
- $\mathbf{v}_j$: el vector que se expresa con los demás.
:::

:::formula[Prueba con determinante]
$$
\mathbf{v}_1, \dots, \mathbf{v}_n \in \mathbb{R}^n \text{ independientes} \iff \det\big[\mathbf{v}_1 \ \cdots \ \mathbf{v}_n\big] \neq 0
$$

- $n$: dimensión del espacio y número de vectores.
- $\big[\mathbf{v}_1 \ \cdots \ \mathbf{v}_n\big]$: matriz cuyas columnas son los vectores.
- $\det$: determinante.
:::
