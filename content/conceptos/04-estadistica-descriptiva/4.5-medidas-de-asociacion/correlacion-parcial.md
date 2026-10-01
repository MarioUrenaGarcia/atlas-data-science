---
id: correlacion-parcial
titulo: Correlación parcial
titulo_en: Partial correlation
alias:
  - correlación controlando por una variable
  - r parcial
modulo: 4
submodulo: '4.5'
orden: 8
nivel: intermedio
prerrequisitos:
  - correlacion-no-implica-causalidad
  - matriz-de-correlacion
etiquetas:
  - asociación
  - control estadístico
  - confusión
  - residuos
resumen: >
  La correlación parcial entre X y Y dado Z es la correlación que queda después de quitar a X y a Y
  la parte que se explica linealmente con Z. Mide la asociación que Z no explica.
formula: 'r_{xy\cdot z} = \frac{r_{xy} - r_{xz}\,r_{yz}}{\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}}'
visualizacion:
  componente: AssociationViz
  parametros:
    modo: confusor
    vista: residuos
    nombres:
      x: Talla de calzado
      y: Palabras que reconoce (cientos)
      z: Edad
    niveles: ['6', '8', '10', '12']
    n: 120
    efectoX: 2
    efectoY: 6
    ruido: 1.2
    origen: [18, 10]
referencias:
  - clave: hastie-esl
    capitulo: '3'
  - clave: degroot
publicado: true
---

## Intuición

En una escuela primaria, los niños con pie más grande reconocen más palabras. La correlación es alta, pero la explicación es obvia: los niños mayores tienen pies más grandes y también han aprendido más palabras. Si se comparara a niños de la misma edad, la talla de calzado no diría nada sobre su vocabulario.

La **correlación parcial** hace esa comparación de manera numérica. En lugar de separar a los niños por edad, quita a cada variable la parte que la edad explica: a la talla le resta la talla que se predice con la edad, y al vocabulario le resta el vocabulario que se predice con la edad. Lo que queda son los "sobrantes", qué tan grande es el pie de un niño para su edad y cuántas palabras sabe para su edad. La correlación entre esos sobrantes es la correlación parcial. Si es cercana a cero, la asociación original se explicaba por la edad.

## Definición

:::definicion[Correlación parcial]
Sean $e_x$ los residuos de la regresión lineal de $x$ sobre $z$ y $e_y$ los residuos de la regresión de $y$ sobre $z$. La **correlación parcial** de $x$ y $y$ dado $z$ es
$$
r_{xy\cdot z} = r(e_x, e_y),
$$
y se puede calcular con las tres correlaciones simples:
$$
r_{xy\cdot z} = \frac{r_{xy} - r_{xz}\,r_{yz}}{\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}}.
$$
:::

Con varias variables de control $z_1, \dots, z_m$, se usan los residuos de regresiones sobre todas ellas. Si $\mathbf{P} = \mathbf{R}^{-1}$ es la inversa de la matriz de correlación, la correlación parcial de las variables $j$ y $k$ dadas todas las demás es $-p_{jk}/\sqrt{p_{jj}\,p_{kk}}$.

:::figura[Correlación parcial positiva: horas de práctica y palabras por minuto, controlando por el nivel inicial. Después de quitar el efecto del nivel, la práctica sigue asociada con el puntaje.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: residuos
nombres:
  x: Horas de práctica
  y: Palabras por minuto
  z: Nivel inicial
niveles: [Bajo, Medio, Alto]
n: 90
efectoX: 4
efectoY: 12
directo: 1.5
ruido: 1.5
origen: [3, 25]
```
:::

:::nota[Qué significa cada símbolo]
- $r_{xy\cdot z}$: correlación parcial de $x$ y $y$ dado $z$.
- $r_{xy}$, $r_{xz}$, $r_{yz}$: correlaciones simples entre cada pareja.
- $e_x$, $e_y$: residuos de las regresiones lineales de $x$ y de $y$ sobre $z$.
- $r(e_x, e_y)$: correlación de Pearson de los residuos.
- $z_1, \dots, z_m$: variables de control.
- $\mathbf{R}$: matriz de correlación; $\mathbf{P} = \mathbf{R}^{-1}$, con entradas $p_{jk}$.
:::

## Cómo usar la visualización

Los puntos son 120 niños de cuatro edades, coloreados por edad. Primero se ve la correlación total, alta. Después cada punto se desplaza a su residuo: la talla menos la talla típica de su edad y el vocabulario menos el típico de su edad. El encabezado calcula la correlación parcial con la fórmula de las tres correlaciones.

Al terminar, los cuatro grupos de colores quedan encimados alrededor del origen y la nube no tiene tendencia: la correlación parcial es cercana a cero. Al cambiar la semilla, la correlación total se mantiene alta y la parcial sigue rondando cero.

## Ejemplo

En un estudio de 200 ciudades se obtienen estas correlaciones: número de bibliotecas y número de restaurantes, $r_{xy} = 0.6$; bibliotecas y población, $r_{xz} = 0.8$; restaurantes y población, $r_{yz} = 0.7$.

1. Numerador: $r_{xy} - r_{xz}\,r_{yz} = 0.6 - 0.8 \cdot 0.7 = 0.6 - 0.56 = 0.04$.
2. Denominador: $\sqrt{(1 - 0.64)(1 - 0.49)} = \sqrt{0.36 \cdot 0.51} = \sqrt{0.1836} \approx 0.428$.
3. $r_{xy\cdot z} = 0.04/0.428 \approx 0.093$.
4. Casi toda la correlación de 0.6 se explica por la población: entre ciudades del mismo tamaño, tener más bibliotecas apenas se relaciona con tener más restaurantes.

:::figura[Una situación como la del ejemplo: dos conteos que crecen con el tamaño de la ciudad. La correlación total es alta y la parcial, cercana a cero.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: residuos
nombres:
  x: Bibliotecas
  y: Restaurantes (decenas)
  z: Tamaño de la ciudad
niveles: [Chica, Mediana, Grande, Muy grande]
n: 100
efectoX: 3
efectoY: 4
ruido: 1.5
origen: [2, 3]
```
:::

## Propiedades

- **Rango:** como cualquier correlación, $-1 \le r_{xy\cdot z} \le 1$.
- **Puede cambiar de signo:** si la causa común empuja en un sentido y la relación directa en el otro, la correlación total y la parcial tienen signos opuestos.
- **Solo quita el efecto lineal:** si $z$ influye de forma no lineal, los residuos conservan parte de su efecto.
- **Relación con la regresión múltiple:** el coeficiente de $x$ en la regresión de $y$ sobre $x$ y $z$ tiene el mismo signo que $r_{xy\cdot z}$.

:::figura[Cambio de signo: precio de una habitación de hotel y ocupación, controlando por la temporada. En temporada alta suben a la vez el precio y la ocupación, así que la correlación total es positiva; dentro de cada temporada, subir el precio reduce la ocupación y la parcial es negativa.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: residuos
nombres:
  x: Precio por noche (cientos)
  y: Ocupación (%)
  z: Temporada
niveles: [Baja, Media, Alta]
n: 90
efectoX: 3
efectoY: 12
directo: -2
ruido: 1
origen: [8, 55]
```
:::

## Errores comunes

- **Controlar por una variable intermedia.** Si $z$ es parte del camino por el que $x$ afecta a $y$, controlar por $z$ elimina justamente el efecto que se quiere estudiar.
- **Creer que controla por todo.** Solo quita el efecto lineal de las variables incluidas; cualquier causa común no medida sigue presente.
- **Interpretar $r_{xy\cdot z} \approx 0$ como prueba de que $x$ no afecta a $y$.** Puede haber efectos no lineales o compensaciones entre grupos.

:::figura[La correlación parcial no elimina relaciones reales: riego y producción de tomate en tres invernaderos de distinta tecnología. Dentro de cada invernadero, más riego sigue asociado con más producción, aunque menos que en el total.]{componente="AssociationViz"}
```yaml
modo: confusor
vista: grupos
nombres:
  x: Riego (litros por planta)
  y: Producción (kg por planta)
  z: Tecnología del invernadero
niveles: [Básica, Intermedia, Avanzada]
n: 90
efectoX: 3
efectoY: 4
directo: 0.8
ruido: 1
origen: [6, 4]
```
:::

## Conexiones

La correlación parcial cuantifica la idea de una causa común de [[correlacion-no-implica-causalidad]] y se obtiene de la inversa de la [[matriz-de-correlacion]]. Es la versión para correlaciones de los coeficientes de la regresión lineal múltiple, y en modelos gráficos gaussianos una correlación parcial nula indica que dos variables son independientes dadas las demás.

## Formulario

:::formula[Correlación parcial con tres variables]
$$
r_{xy\cdot z} = \frac{r_{xy} - r_{xz}\,r_{yz}}{\sqrt{(1 - r_{xz}^2)(1 - r_{yz}^2)}}
$$

- $r_{xy}, r_{xz}, r_{yz}$: correlaciones simples.
:::

:::formula[Como correlación de residuos]
$$
r_{xy\cdot z} = r(e_x, e_y), \qquad e_x = x - \hat{x}(z), \quad e_y = y - \hat{y}(z)
$$

- $\hat{x}(z)$, $\hat{y}(z)$: predicciones lineales de $x$ y de $y$ a partir de $z$.
:::

:::formula[A partir de la matriz de precisión]
$$
r_{jk\cdot \text{resto}} = -\frac{p_{jk}}{\sqrt{p_{jj}\,p_{kk}}}, \qquad \mathbf{P} = \mathbf{R}^{-1}
$$

- $p_{jk}$: entradas de la inversa de la matriz de correlación.
:::
