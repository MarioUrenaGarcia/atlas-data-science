---
id: distribucion-uniforme-discreta
titulo: Distribución uniforme discreta
titulo_en: Discrete uniform distribution
alias:
  - uniforme discreta
  - distribución equiprobable
  - discrete uniform
modulo: 2
submodulo: '2.1'
orden: 1
nivel: basico
prerrequisitos:
  - notacion-sumatoria-y-productoria
relaciones:
  - tipo: contrasta
    id: distribucion-categorica
  - tipo: relacionado
    id: distribucion-de-bernoulli
etiquetas:
  - distribución discreta
  - equiprobabilidad
  - dado
  - sorteo
resumen: >
  Asigna la misma probabilidad a cada uno de los n enteros consecutivos entre a y b. Modela sorteos
  justos, como un dado o un número de boleto elegido al azar.
formula: 'P(X = k) = \frac{1}{b - a + 1}, \quad k = a, a + 1, \dots, b'
visualizacion:
  componente: DistributionStudio
  parametros:
    explorador:
      distribucion: uniforme-discreta
      valores:
        a: 1
        b: 20
      casos:
        - nombre: 'Dado de seis caras'
          descripcion: 'Valores del 1 al 6: seis barras iguales de 1/6; ninguna cara tiene ventaja.'
          valores: {a: 1, b: 6}
        - nombre: 'Día de auditoría'
          descripcion: 'Un día hábil al azar entre 1 y 20: veinte barras de 0.05, media 10.5.'
          valores: {a: 1, b: 20}
        - nombre: 'Dígito aleatorio'
          descripcion: 'Un dígito del 0 al 9: diez barras de 0.1; la media 4.5 no es un valor posible.'
          valores: {a: 0, b: 9}
      ejemplo:
        titulo: 'Auditoría en la primera semana'
        contexto: 'Una planta elige al azar uno de sus 20 días hábiles del mes para una auditoría sorpresa.'
        pregunta: '¿Qué probabilidad hay de que la auditoría caiga en los primeros 5 días?'
        valores: {a: 1, b: 20}
        region: izquierda
        desde: 5
    genesis:
      componente: DistributionGenesis
      parametros:
        proceso: dado
        valores:
          a: 1
          b: 6
          k: 1
referencias:
  - clave: blitzstein-hwang
    capitulo: '3'
  - clave: ross-probabilidad
publicado: true
---

## Intuición

Un dado bien construido no tiene caras favoritas: cada una de las seis sale con la misma frecuencia a la larga. Lo mismo ocurre con una tómbola que mezcla bien sus boletos o con un programa que elige al azar un número de folio entre los registrados. En todos estos casos hay una lista finita de resultados consecutivos y ninguna razón para preferir uno sobre otro.

La distribución uniforme discreta formaliza esa ausencia de preferencias: reparte la probabilidad total, que vale uno, en partes iguales entre los valores posibles. Si hay seis valores, cada uno recibe un sexto; si hay veinte, un veinteavo. De ahí salen todas sus propiedades. El centro está justo a la mitad entre el menor y el mayor valor, porque la distribución es simétrica. La dispersión depende solo de cuántos valores hay, no de dónde están: un dado numerado del 1 al 6 y otro numerado del 11 al 16 varían exactamente igual.

Esta distribución es también el punto de partida de muchas simulaciones: sumar dados, barajar cartas o elegir una muestra al azar empiezan con una elección uniforme. Pero sumar o combinar elecciones uniformes ya no produce resultados uniformes, como muestra la suma de dos dados.

## Definición

:::definicion[Distribución uniforme discreta]
Sean $a \le b$ enteros y $n = b - a + 1$ el número de valores entre ellos. Una variable aleatoria $X$ tiene **distribución uniforme discreta** en $\{a, a + 1, \dots, b\}$, y se escribe $X \sim U\{a, \dots, b\}$, si
$$
P(X = k) = \frac{1}{n} \quad \text{para } k = a, a + 1, \dots, b,
$$
y $P(X = k) = 0$ para cualquier otro valor.
:::

Su función de distribución acumulada es una escalera de $n$ peldaños de altura $1/n$:
$$
F(x) = P(X \le x) = \begin{cases} 0, & x < a, \\ \dfrac{\lfloor x \rfloor - a + 1}{n}, & a \le x < b, \\ 1, & x \ge b. \end{cases}
$$

:::nota[Qué significa cada símbolo]
- $X$: variable aleatoria con el valor obtenido.
- $a$, $b$: menor y mayor valor posibles, enteros.
- $n = b - a + 1$: número de valores posibles; se suma uno porque se cuentan ambos extremos.
- $k$: un valor particular entre $a$ y $b$.
- $P(X = k)$: probabilidad de obtener exactamente $k$.
- $F(x)$: probabilidad acumulada hasta $x$.
- $\lfloor x \rfloor$: parte entera de $x$, el mayor entero que no supera a $x$.
:::

## Cómo usar la visualización

La pestaña Distribución muestra las barras de la función de masa, todas de altura $1/n$, y la región elegida en el selector con su probabilidad. Los casos cargan un dado, el día de una auditoría y un dígito al azar; el ejemplo de la ficha se carga con su botón. La pestaña Ver cómo surge lanza un dado y acumula los resultados; con $k = 2$ suma dos dados y el histograma deja de ser plano.

Al mover $a$ sin cambiar el número de valores, la media se desplaza y la varianza no cambia. En la vista de función de distribución aparece una escalera de $n$ peldaños.

## Ejemplo

Una planta de alimentos programa una auditoría sorpresa en uno de los 20 días hábiles del mes, elegido al azar. Sea $X$ el número del día hábil elegido, con $X \sim U\{1, \dots, 20\}$.

1. Número de valores: $n = 20 - 1 + 1 = 20$, así que cada día tiene probabilidad $1/20 = 0.05$.
2. Probabilidad de que la auditoría caiga en la primera semana (días 1 a 5): $P(X \le 5) = 5/20 = 0.25$.
3. Día esperado: $\mathbb{E}[X] = (1 + 20)/2 = 10.5$, la mitad del mes.
4. Varianza: $\operatorname{Var}(X) = (20^2 - 1)/12 = 399/12 = 33.25$, con desviación estándar $\sqrt{33.25} \approx 5.77$ días.

:::figura[Los 20 días hábiles con probabilidad 0.05 cada uno. El intervalo sombreado, días 1 a 5, acumula 0.25; el triángulo bajo el eje marca la media 10.5.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 1
  b: 20
ejemplo:
  titulo: 'Auditoría en la primera semana'
  contexto: 'Una planta elige al azar uno de sus 20 días hábiles del mes para una auditoría sorpresa.'
  pregunta: '¿Qué probabilidad hay de que la auditoría caiga en los primeros 5 días?'
  valores: {a: 1, b: 20}
  region: izquierda
  desde: 5
region: izquierda
desde: 5
muestras: false
```
:::

## Propiedades

- **Media:** $\mathbb{E}[X] = \dfrac{a + b}{2}$, el punto medio, porque la distribución es simétrica alrededor de él.
- **Varianza:** $\operatorname{Var}(X) = \dfrac{n^2 - 1}{12}$, que depende solo de $n$.
- **Desplazamiento:** si $X \sim U\{a, \dots, b\}$ y $c$ es entero, entonces $X + c \sim U\{a + c, \dots, b + c\}$: la media se mueve $c$ y la varianza no cambia.
- **Probabilidad de un tramo:** para $a \le c \le d \le b$, $P(c \le X \le d) = \dfrac{d - c + 1}{n}$.
- **Máxima incertidumbre:** entre todas las distribuciones sobre $n$ valores, la uniforme es la que tiene mayor entropía.

:::figura[Tres casos con contexto (dado de seis caras, día de auditoría, dígito aleatorio): cada botón carga los parámetros y una frase explica por qué la forma es así.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 1
  b: 20
casos:
  - nombre: 'Dado de seis caras'
    descripcion: 'Valores del 1 al 6: seis barras iguales de 1/6; ninguna cara tiene ventaja.'
    valores: {a: 1, b: 6}
  - nombre: 'Día de auditoría'
    descripcion: 'Un día hábil al azar entre 1 y 20: veinte barras de 0.05, media 10.5.'
    valores: {a: 1, b: 20}
  - nombre: 'Dígito aleatorio'
    descripcion: 'Un dígito del 0 al 9: diez barras de 0.1; la media 4.5 no es un valor posible.'
    valores: {a: 0, b: 9}
```
:::

:::figura[Simetría y media: con valores del 3 al 9 la masa se reparte por igual a ambos lados de 6, que es la media (3 + 9)/2.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 3
  b: 9
desde: 3
hasta: 6
muestras: false
```
:::

:::figura[La varianza depende solo de n. Del 0 al 4 y del 6 al 10 (línea punteada) hay cinco valores en cada caso, y ambas tienen varianza (25 - 1)/12 = 2; solo cambia la posición.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 0
  b: 4
dominio: [-0.5, 10.5]
muestras: false
referencia:
  distribucion: uniforme-discreta
  valores:
    a: 6
    b: 10
  etiqueta: Del 6 al 10
```
:::

:::figura[La función de distribución de un dado es una escalera de seis peldaños de altura 1/6. El cuantil que acumula 0.5 es 3.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 1
  b: 6
vista: acumulada
probabilidad: 0.5
muestras: false
```
:::

:::demostracion
Sea $Y = X - a$, uniforme en $\{0, \dots, n - 1\}$. Con las sumas $\sum_{j=0}^{n-1} j = \frac{(n-1)n}{2}$ y $\sum_{j=0}^{n-1} j^2 = \frac{(n-1)n(2n-1)}{6}$ se obtiene $\mathbb{E}[Y] = \frac{n-1}{2}$ y $\mathbb{E}[Y^2] = \frac{(n-1)(2n-1)}{6}$. Entonces
$$
\operatorname{Var}(Y) = \frac{(n-1)(2n-1)}{6} - \frac{(n-1)^2}{4} = \frac{(n-1)\left[2(2n-1) - 3(n-1)\right]}{12} = \frac{(n-1)(n+1)}{12}.
$$
Como $X = Y + a$, la media es $a + \frac{n-1}{2} = \frac{a+b}{2}$ y la varianza es la misma, $\frac{n^2 - 1}{12}$.
:::

## Errores comunes

- **Suponer que la suma de dos uniformes es uniforme.** Al lanzar dos dados, la suma 7 se obtiene de 6 maneras y la suma 2 de una sola, así que $P(7) = 6/36$ y $P(2) = 1/36$. La suma tiene forma triangular.
- **Contar mal los valores.** Entre 5 y 12 hay $12 - 5 + 1 = 8$ enteros, no 7. Con $X \sim U\{1, \dots, 20\}$, $P(5 \le X \le 12) = 8/20 = 0.4$.
- **Confundirla con la uniforme continua.** En la discreta cada valor tiene probabilidad positiva; en la continua la probabilidad de un punto exacto es cero y lo que importa es la longitud de los intervalos.
- **Creer que pocas repeticiones deben verse parejas.** Con 30 tiradas de un dado justo es normal que una cara salga 2 veces y otra 8; la igualdad aparece solo en frecuencias de largo plazo.

:::figura[Dos dados sumados. Las 36 combinaciones igualmente probables producen sumas que no lo son: el 7 es seis veces más probable que el 2 o el 12.]{componente="DistributionGenesis"}
```yaml
proceso: dado
valores:
  a: 1
  b: 6
  k: 2
```
:::

:::figura[Conteo correcto del tramo 5 a 12 con 20 valores: se sombrean 8 barras de 0.05, que suman 0.4.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 1
  b: 20
desde: 5
hasta: 12
muestras: false
```
:::

:::figura[Discreta frente a continua. Las barras de los valores 0 a 4 tienen altura 1/5 y son probabilidades; la línea punteada es la densidad de la uniforme continua entre -0.5 y 4.5, que también vale 1/5 pero no es la probabilidad de ningún punto.]{componente="DistributionExplorer"}
```yaml
distribucion: uniforme-discreta
valores:
  a: 0
  b: 4
dominio: [-1.5, 5.5]
muestras: false
referencia:
  distribucion: uniforme
  valores:
    a: -0.5
    b: 4.5
  etiqueta: Uniforme continua (densidad)
```
:::

:::figura[Las primeras tiradas de un dado de 20 caras producen un histograma irregular aunque todas las caras sean igual de probables. Con cientos de tiradas se nivela alrededor de 0.05.]{componente="DistributionGenesis"}
```yaml
proceso: dado
valores:
  a: 1
  b: 20
  k: 1
semilla: 30
```
:::

## Conexiones

La uniforme discreta es la distribución de un resultado elegido en un espacio equiprobable con valores numéricos consecutivos. Cuando los resultados no son igualmente probables se usa la [[distribucion-categorica]]; con solo dos valores, 0 y 1, e igual probabilidad, coincide con la [[distribucion-de-bernoulli]] de parámetro 1/2. La suma de varias uniformes discretas da distribuciones triangulares y, con muchos sumandos, aproximadamente normales. Las sumas de la media y la varianza usan la [[notacion-sumatoria-y-productoria]].

## Formulario

:::formula[Función de masa]
$$
P(X = k) = \frac{1}{n}, \qquad n = b - a + 1, \qquad k = a, \dots, b
$$

- $X$: valor obtenido.
- $a$, $b$: extremos enteros del rango.
- $n$: número de valores posibles.
- $k$: valor particular.
:::

:::formula[Función de distribución]
$$
F(x) = \frac{\lfloor x \rfloor - a + 1}{n}, \qquad a \le x < b
$$

- $F(x)$: probabilidad de obtener un valor menor o igual que $x$.
- $\lfloor x \rfloor$: parte entera de $x$.
- Vale 0 antes de $a$ y 1 desde $b$.
:::

:::formula[Media y varianza]
$$
\mathbb{E}[X] = \frac{a + b}{2}, \qquad \operatorname{Var}(X) = \frac{n^2 - 1}{12}
$$

- $\mathbb{E}[X]$: valor esperado, el punto medio del rango.
- $\operatorname{Var}(X)$: varianza, que depende solo del número de valores $n$.
:::

:::formula[Probabilidad de un tramo]
$$
P(c \le X \le d) = \frac{d - c + 1}{n}
$$

- $c$, $d$: enteros con $a \le c \le d \le b$.
- $d - c + 1$: número de valores del tramo, contando ambos extremos.
:::
