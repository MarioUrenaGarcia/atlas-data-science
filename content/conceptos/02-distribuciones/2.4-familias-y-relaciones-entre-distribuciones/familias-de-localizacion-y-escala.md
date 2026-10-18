---
id: familias-de-localizacion-y-escala
titulo: Familias de localización y escala
titulo_en: Location-scale families
alias:
  - familia de localización
  - familia de escala
  - estandarización de una familia
modulo: 2
submodulo: '2.4'
orden: 3
nivel: intermedio
prerrequisitos:
  - normal-estandar-y-puntuacion-z
  - distribucion-de-cauchy
relaciones:
  - tipo: relacionado
    id: distribucion-normal
etiquetas:
  - localización
  - escala
  - estandarización
  - transformación lineal
  - cuantiles
resumen: >
  Familia de distribuciones generada al trasladar y estirar una distribución estándar: X = μ + σZ. Todas
  sus integrantes tienen la misma forma y sus cuantiles se transforman con la misma regla.
formula: 'f_X(x) = \frac{1}{\sigma}\,f_Z\!\left(\frac{x - \mu}{\sigma}\right), \qquad X = \mu + \sigma Z'
visualizacion:
  componente: FamilyLab
  parametros:
    modo: localizacion-escala
    base: normal
    valores:
      mu: 2
      sigma: 1.5
    casos:
      - nombre: 'Celsius a Fahrenheit'
        descripcion: 'Normal estándar con μ = 2 y σ = 1.5: el mismo cambio de origen y escala que convierte unidades; la forma no cambia.'
        valores: {mu: 2, sigma: 1.5}
      - nombre: 'Error angosto'
        descripcion: 'σ = 0.4: la curva se comprime y sube; el área sigue siendo uno porque la densidad se divide entre σ.'
        valores: {mu: 0, sigma: 0.4}
      - nombre: 'Corrimiento puro'
        descripcion: 'μ = -3 y σ = 1: la curva se traslada sin cambiar ancho ni altura.'
        valores: {mu: -3, sigma: 1}
referencias:
  - clave: casella-berger
  - clave: degroot
publicado: true
---

## Intuición

Convertir una temperatura de grados Celsius a Fahrenheit es multiplicar por 1.8 y sumar 32. Si las temperaturas de una ciudad tienen cierta distribución en Celsius, en Fahrenheit tienen la misma forma: el pico sigue siendo un pico y las colas siguen siendo colas, solo que la escala del eje cambió. Cambiar de unidades no cambia la forma de una distribución.

Una familia de localización y escala es exactamente el conjunto de distribuciones que se obtienen así a partir de una distribución estándar: trasladándola (localización) y estirándola o comprimiéndola (escala). La normal es el ejemplo clásico: toda normal es una normal estándar trasladada a su media y estirada por su desviación. Lo mismo pasa con la Cauchy, la logística, la Laplace, la Gumbel y la uniforme.

La consecuencia práctica es que basta estudiar un solo miembro, el estándar. Las probabilidades de cualquier otro se obtienen estandarizando: restando la localización y dividiendo entre la escala. Por eso existen tablas de la normal estándar y no de cada normal posible, y por eso los cuantiles, la mediana y el rango intercuartílico se transforman con la misma regla lineal.

## Definición

:::definicion[Familia de localización y escala]
Sea $f_Z$ una densidad fija. La **familia de localización y escala** generada por $f_Z$ es el conjunto de densidades
$$
f(x \mid \mu, \sigma) = \frac{1}{\sigma}\,f_Z\!\left(\frac{x - \mu}{\sigma}\right), \qquad \mu \in \mathbb{R},\ \sigma > 0.
$$
Equivalentemente, $X$ pertenece a la familia si $X = \mu + \sigma Z$ con $Z \sim f_Z$. Con $\sigma = 1$ fijo se obtiene una **familia de localización**; con $\mu = 0$ fijo, una **familia de escala**.
:::

Las funciones de distribución y los cuantiles cumplen $F_X(x) = F_Z\!\left(\frac{x - \mu}{\sigma}\right)$ y $x_q = \mu + \sigma z_q$.

:::nota[Qué es X]
$X$ = una medición que se obtiene de una variable estándar cambiando origen y unidades, como una temperatura en grados Fahrenheit.
:::

:::nota[Qué hace cada parámetro]
- **$\mu$, localización:** dónde está la distribución. Si aumenta, la curva se traslada a la derecha sin cambiar de forma ni de altura.
- **$\sigma$, escala:** qué tan extendida está. Si aumenta, la curva se ensancha y baja en la misma proporción, de modo que el área sigue valiendo uno.
:::

:::nota[Qué significa cada símbolo]
- $f_Z$: densidad del miembro estándar; $Z$: variable estándar.
- $f(x \mid \mu, \sigma)$: densidad del miembro con localización $\mu$ y escala $\sigma$.
- $F_X$, $F_Z$: funciones de distribución de $X$ y de $Z$.
- $x_q$, $z_q$: cuantiles de orden $q$ de $X$ y de $Z$.
:::

## Cómo usar la visualización

La curva punteada es el miembro estándar de la familia elegida y la continua es $X = \mu + \sigma Z$. Los segmentos llevan los tres cuartiles del estándar a sus nuevas posiciones, $\mu + \sigma z_q$. El selector cambia la familia (normal, logística, Cauchy, Laplace o Gumbel); el panel da la mediana, el rango intercuartílico y, cuando existen, la media y la desviación.

Sube $\sigma$ y observa que la curva se aplana y los cuartiles se separan en proporción. Cambia a la Cauchy y observa que la media dice "no existe", aunque la mediana y el rango intercuartílico siguen transformándose igual. Con la Gumbel, que es asimétrica, mueve $\mu$ y observa que la asimetría no cambia.

## Ejemplo

La temperatura máxima de julio en una ciudad, en °C, es $C \sim \mathcal{N}(20, 4^{2})$. Se convierte a Fahrenheit con $F = 32 + 1.8\,C$.

1. La normal es una familia de localización y escala, así que $F$ también es normal.
2. Localización: $32 + 1.8 \cdot 20 = 68$ °F. Escala: $1.8 \cdot 4 = 7.2$ °F.
3. Por lo tanto $F \sim \mathcal{N}(68, 7.2^{2})$.
4. La probabilidad de un día con más de 25 °C es $P(Z > \frac{25 - 20}{4}) = P(Z > 1.25) \approx 0.1056$.
5. En Fahrenheit el umbral es $32 + 1.8 \cdot 25 = 77$ y $P(F > 77) = P(Z > \frac{77 - 68}{7.2}) = P(Z > 1.25)$: la misma probabilidad, como debe ser al cambiar solo de unidades.

:::figura[Celsius a Fahrenheit en unidades estándar: la normal estándar (punteada) trasladada 2 y estirada 1.5 conserva su forma; los cuartiles viajan con la regla μ + σz.]{componente="FamilyLab"}
```yaml
modo: localizacion-escala
base: normal
valores:
  mu: 2
  sigma: 1.5
```
:::

## Propiedades

- **Momentos:** si existen, $\mathbb{E}[X] = \mu + \sigma\,\mathbb{E}[Z]$ y $\operatorname{Var}(X) = \sigma^{2}\operatorname{Var}(Z)$.
- **Cuantiles:** $x_q = \mu + \sigma z_q$; la mediana se traslada y escala, y el rango intercuartílico se multiplica por $\sigma$.
- **Estandarización:** $Z = (X - \mu)/\sigma$ tiene siempre la distribución estándar; basta una tabla para toda la familia.
- **Forma invariante:** la asimetría y la curtosis no dependen de $\mu$ ni de $\sigma$.
- **Cierre:** si $X$ está en la familia, $a + bX$ con $b > 0$ también lo está, con localización $a + b\mu$ y escala $b\sigma$.
- **Ejemplos:** normal, Cauchy, logística, Laplace, Gumbel y uniforme son familias de localización y escala; la exponencial y la gamma con forma fija son familias de escala.

:::figura[Casos con contexto (cambio de unidades, error angosto, corrimiento puro): cada botón carga μ y σ, y una frase explica qué cambia en la curva.]{componente="FamilyLab"}
```yaml
modo: localizacion-escala
base: normal
valores:
  mu: 0
  sigma: 1
casos:
  - nombre: 'Celsius a Fahrenheit'
    descripcion: 'μ = 2 y σ = 1.5: misma forma, otro lugar y otro ancho.'
    valores: {mu: 2, sigma: 1.5}
  - nombre: 'Error angosto'
    descripcion: 'σ = 0.4: la curva se comprime y sube.'
    valores: {mu: 0, sigma: 0.4}
  - nombre: 'Corrimiento puro'
    descripcion: 'μ = -3: solo se traslada.'
    valores: {mu: -3, sigma: 1}
```
:::

:::figura[Cauchy: la familia tiene localización y escala aunque no tenga media; la mediana pasa de 0 a μ y el rango intercuartílico, de 2 a 2σ.]{componente="FamilyLab"}
```yaml
modo: localizacion-escala
base: cauchy
valores:
  mu: 1
  sigma: 2
```
:::

:::figura[Gumbel: la asimetría a la derecha se conserva al trasladar y escalar; ni μ ni σ la corrigen.]{componente="FamilyLab"}
```yaml
modo: localizacion-escala
base: gumbel
valores:
  mu: -1
  sigma: 1.8
```
:::

## Errores comunes

- **Identificar la escala con la desviación estándar.** En la normal coinciden, pero en la logística la desviación es $\sigma\pi/\sqrt{3}$ y en la Cauchy la desviación no existe.
- **Identificar la localización con la media.** En la Gumbel la media es $\mu + 0.5772\,\sigma$, no $\mu$.
- **Creer que estandarizar vuelve normal a una variable.** Estandarizar quita la localización y la escala, pero conserva la forma.
- **Olvidar dividir la densidad entre $\sigma$.** Sin ese factor el área no sería uno.

:::figura[Estandarizar no normaliza la forma: la Laplace estándar (punteada) y su versión con μ = 0.5, σ = 0.8 tienen el mismo pico agudo, distinto del de una normal.]{componente="FamilyLab"}
```yaml
modo: localizacion-escala
base: laplace
valores:
  mu: 0.5
  sigma: 0.8
```
:::

## Conexiones

La estandarización de la [[normal-estandar-y-puntuacion-z]] es el caso más conocido, y la [[distribucion-normal]], la [[distribucion-de-cauchy]], la [[distribucion-logistica]], la [[distribucion-de-laplace]] y la [[distribucion-de-gumbel]] son familias de este tipo. Es distinta de la [[familia-exponencial]]: la normal pertenece a las dos, pero la Cauchy solo a esta. La transformación lineal de una variable es la base de la estandarización de datos en estadística descriptiva. El [[mapa-de-relaciones-entre-distribuciones]] reúne las familias del módulo.

## Formulario

:::formula[Densidad de la familia]
$$
f(x \mid \mu, \sigma) = \frac{1}{\sigma}\,f_Z\!\left(\frac{x - \mu}{\sigma}\right)
$$

- $f_Z$: densidad estándar; $\mu$: localización; $\sigma$: escala.
:::

:::formula[Función de distribución y cuantiles]
$$
F_X(x) = F_Z\!\left(\frac{x - \mu}{\sigma}\right), \qquad x_q = \mu + \sigma z_q
$$

- $F_Z$: distribución estándar; $z_q$: su cuantil de orden $q$.
:::

:::formula[Momentos]
$$
\mathbb{E}[X] = \mu + \sigma\,\mathbb{E}[Z], \qquad \operatorname{Var}(X) = \sigma^{2}\operatorname{Var}(Z)
$$

- Solo si los momentos de $Z$ existen.
:::

:::formula[Cambio de unidades]
$$
F = 32 + 1.8\,C, \qquad C \sim \mathcal{N}(20, 4^{2}) \Rightarrow F \sim \mathcal{N}(68, 7.2^{2})
$$

- $C$: temperatura en °C; $F$: en °F.
:::
